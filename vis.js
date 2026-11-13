import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Vis settings
const colors = {
  "SSP1-2.6": "#32966f",
  "SSP2-4.5": "#e0a633",
  "SSP5-8.5": "#de4321"
};

const names = {
  "SSP1-2.6": "Low Emissions",
  "SSP2-4.5": "Moderate Emissions",
  "SSP5-8.5": "High Emissions"
};

let data = [];
let active = new Set(Object.keys(names));
let startYear = 2015;
let endYear = 2100;

const margin = { top: 25, right: 30, bottom: 60, left: 75 };
const width = 1050 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", `0 0 1050 600`);

const chart = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const x = d3.scaleLinear()
  .domain([2015, 2100])
  .range([0, width]);

const y = d3.scaleLinear()
  .range([height, 0]);

// Axes
const xAxis = chart.append("g")
  .attr("transform", `translate(0,${height})`);

const yAxis = chart.append("g");

chart.append("text")
  .attr("x", width / 2)
  .attr("y", height + 45)
  .attr("text-anchor", "middle")
  .text("Year");

chart.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -50)
  .attr("text-anchor", "middle")
  .text("Global Temperature (°C)");

// Grid
const grid = chart.append("g");

// Highlight selected period
const highlight = chart.append("rect")
  .attr("y", 0)
  .attr("height", height)
  .attr("fill", "#86b3be")
  .attr("opacity", 0.2)
  .attr("pointer-events", "none");

// Lines
const line = d3.line()
  .x(d => x(d.year))
  .y(d => y(d.global_temp_c));

const lines = chart.append("g");

// Tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

const hoverLine = chart.append("line")
  .attr("stroke", "#333")
  .attr("stroke-dasharray", "4,4")
  .style("display", "none");

const infoBox = chart.append("g")
  .style("display", "none")
  .attr("transform", `translate(${width - 220}, 10)`);

infoBox.append("rect")
  .attr("width", 210)
  .attr("height", 100)
  .attr("rx", 8)
  .attr("fill", "#484747")
  .attr("opacity", 0.95);

const infoText = infoBox.append("text")
  .attr("x", 12)
  .attr("y", 22)
  .attr("fill", "white")
  .style("font-size", "12px");

// Summary cards
function updateSummary() {
  const container = d3.select("#summary-cards");
  container.html("");

  active.forEach(scenario => {

    const startData = data.find(d =>
      d.scenario === scenario && d.year === startYear
    );

    const endData = data.find(d =>
      d.scenario === scenario && d.year === endYear
    );

    if (!startData || !endData) return;

    // Temperature change
    const change = endData.global_temp_c - startData.global_temp_c;

    // Warming rate per year
    const rate = change / (endYear - startYear);

    // Create summary card
    const card = container.append("div")
      .attr("class", "summary-card")
      .style("border-top-color", colors[scenario]);

    card.append("h3")
      .text(names[scenario]);

    card.append("p")
      .text(`Temperature change: ${change >= 0 ? "+" : ""}${change.toFixed(2)} °C`);

    card.append("p")
      .text(`Warming rate: ${rate.toFixed(4)} °C/year`);

    card.append("p")
      .text(`Period: ${startYear}–${endYear}`);
  });

  if (active.size === 0) {
    container.append("p")
      .text("Select a scenario to see its summary.");
  }
}

// Update vis based on filtering
function updateChart() {
  const visible = data.filter(d => active.has(d.scenario));

  if (!visible.length) {
    lines.selectAll("path").remove();
    updateSummary();
    return;
  }

  const minTemp = d3.min(visible, d => d.global_temp_c);
  const maxTemp = d3.max(visible, d => d.global_temp_c);
  const padding = Math.max((maxTemp - minTemp) * 0.12, 0.1);

  y.domain([minTemp - padding, maxTemp + padding]).nice();

  xAxis.call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(10));
  yAxis.call(d3.axisLeft(y));

  grid.call(
    d3.axisLeft(y).tickSize(-width).tickFormat("")
  );

  highlight
    .attr("x", x(startYear))
    .attr("width", x(endYear) - x(startYear));

  const paths = lines.selectAll("path")
    .data([...active], d => d);

  paths.exit().remove();

  paths.enter()
    .append("path")
    .merge(paths)
    .attr("fill", "none")
    .attr("stroke", d => colors[d])
    .attr("stroke-width", 2.5)
    .attr("d", scenario =>
      line(data.filter(d => d.scenario === scenario)
        .sort((a, b) => a.year - b.year))
    );

  updateSummary();
}

// Hover
const overlay = chart.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "transparent");

overlay
  .on("mousemove", function(event) {

    const [mouseX, mouseY] = d3.pointer(event, chart.node());
    const year = Math.round(x.invert(mouseX));

    // Keep info box inside the vis
    const boxWidth = 210;
    const boxHeight = 115;

    const boxX = mouseX + boxWidth + 15 > width
      ? mouseX - boxWidth - 15
      : mouseX + 15;

    const boxY = mouseY + boxHeight + 15 > height
      ? mouseY - boxHeight - 15
      : mouseY + 15;

    infoBox.attr(
      "transform",
      `translate(${boxX}, ${boxY})`
    );

    if (year < 2015 || year > 2100) return;

    // Move hover line
    hoverLine
      .style("display", null)
      .attr("x1", x(year))
      .attr("x2", x(year))
      .attr("y1", 0)
      .attr("y2", height);

    // Show info box
    infoBox.style("display", null);

    infoText.selectAll("tspan").remove();

    infoText.append("tspan")
      .attr("x", 12)
      .attr("dy", 0)
      .style("font-weight", "bold")
      .text(`Year: ${year}`);

    let row = 1;

    active.forEach(scenario => {

      const point = data.find(d =>
        d.scenario === scenario && d.year === year
      );

      if (point) {
        infoText.append("tspan")
          .attr("x", 12)
          .attr("dy", row === 1 ? 23 : 20)
          .attr("fill", colors[scenario])
          .text(`${names[scenario]}: ${point.global_temp_c.toFixed(2)} °C`);

        row++;
      }
    });

    infoBox.select("rect")
      .attr("height", 35 + (row - 1) * 20);

  })
  .on("mouseleave", function() {

    hoverLine.style("display", "none");
    infoBox.style("display", "none");

  });

// Scenario filters
d3.selectAll(".scenario-button").on("click", function() {
  const scenario = this.dataset.scenario;

  if (active.has(scenario)) {
    active.delete(scenario);
    this.classList.remove("active");
  } else {
    active.add(scenario);
    this.classList.add("active");
  }

  updateChart();
});

// Year sliders
const startSlider = document.getElementById("startYear");
const endSlider = document.getElementById("endYear");

startSlider.addEventListener("input", function() {
  startYear = Math.min(+this.value, endYear - 1);
  this.value = startYear;
  document.getElementById("startYearValue").textContent = startYear;
  updateChart();
});

endSlider.addEventListener("input", function() {
  endYear = Math.max(+this.value, startYear + 1);
  this.value = endYear;
  document.getElementById("endYearValue").textContent = endYear;
  updateChart();
});

// Load csv
d3.csv("all_scenarios.csv", d => ({
  year: +d.year,
  global_temp_c: +d.global_temp_c,
  scenario: d.scenario.trim()
}))
.then(loadedData => {
  data = loadedData.filter(d =>
    Number.isFinite(d.year) &&
    Number.isFinite(d.global_temp_c) &&
    names[d.scenario]
  );

  const minYear = d3.min(data, d => d.year);
  const maxYear = d3.max(data, d => d.year);

  startYear = minYear;
  endYear = maxYear;

  startSlider.min = minYear;
  startSlider.max = maxYear;
  startSlider.value = minYear;

  endSlider.min = minYear;
  endSlider.max = maxYear;
  endSlider.value = maxYear;

  document.getElementById("startYearValue").textContent = minYear;
  document.getElementById("endYearValue").textContent = maxYear;

  updateChart();
})