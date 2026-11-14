# Project 3 Write-Up: Global Temperature Projections Under Different Emissions Scenarios

## 1. Project Overview

Our group made an interactive chart which compared the projected temperatures for three different scenarios of emissions until the year 2100. The scenarios we looked at were SSP1-2.6 (low emissions), SSP2-4.5 (moderate emissions), and SSP5-8.5 (high emissions). The temperatures in the chart range from 2015 until 2100.

Ultimately the aim of this project was to be able to better view long-term climate change projections, especially different scenarios, and to determine the change in temperature over time for specific time periods and years.

D3.js, JavaScript, HTML, CSS and the climate projections in CSV format, prepared by Python, were used for the visualization.

## 2. Design Rationale

We chose a multi-line chart because our dataset consists of annual temperature projections across a continuous time period. A line chart makes it easier to identify long-term trends, observe changes in warming rates, and compare how the three scenarios diverge toward the end of the century.

On the x-axis there are years from 2015 to 2100. The y-axis depicts temperatures (in °C) for global average surface temperature of Earth. Every single emission pathway has been colored in specific manner: SSP1-2.6 is green, SSP2-4.5 is yellow-orange, and SSP5-8.5 is red. Their respective temperature forecasts are constantly related to their respective emission scenarios, thereby providing the basis for the design decisions that were chosen for the visual part of the project.

To enhance interactive aspects for users to explore the data set, various interface features have been added to facilitate in-depth analysis and facilitate specific queries of interest. For each of the emissions scenarios (or ‘conditions’), buttons are used to add/doff respective data lines as required. Users can then hover over the appropriate trend line to observe specific information for respective years. Total temperature change for selected time slots, along with relevant average annual temperature change, are calculated and made available as summary information on the right-hand side.

To better understand the temperature change over shorter time frames the visualization includes two sliders to choose a starting year and an ending year. The visualization highlights the chosen time frame but still shows the complete time series. This allows users to compare temperature changes over shorter time frames with the long-term temperature change of the complete scenario.

The summary cards provide additional statistics to compare the different pathways selected by the user. There are two statistics provided: the total temperature change and the average temperature change in every year of the selected time frame. The cards provide quantitative data to support the observations made from the trends in the visualization.

The visualisation and interaction together form a coherent design for the comparison of climate change forecast under different scenarios of emissions of greenhouse gases.

We also considered using a bar chart, but decided that a line chart would be more useful because it shows continuous temperature changes over time and makes it easier to compare the three scenarios.

## 3. Data Processing and Transformations

The data for this project is from CMIP6 climate projections for three Shared Socioeconomic Pathways (SSPs): SSP1-2.6, SSP2-4.5, and SSP5-8.5.

In addition to the three temperature time series (for the SSP scenarios SSP1-2.6, SSP2-4.5, and SSP5-8.5), the repository also contains a fourth file, named all_scenarios.csv, which is used by the visualization.

First, we show the Python code that was used for data preprocessing to calculate annual global average surface temperature from gridded climate data. The weight for each latitude is a cosine value which accounts for surface area of different latitudes. After that, temperatures were converted from Kelvin to Celsius by subtracting 273.15 from them. Next, temperatures were averaged annually for each year.

These three files are then combined in a uniform format (year, temperature in °C for the globe, and ID for the scenario to graph).

In JavaScript we use D3 to load the combined CSV file for all scenarios and convert numerical fields to numbers. Observations with no valid temperature for a given time and observations with scenarios not in the three given scenarios for this project are filtered out. After that the data for each scenario is separated and sorted chronologically. Three lines are created from this data, one for each of the low, moderate and high emissions scenarios.

In the following section we show how we dynamically calculate the temperature change for the user selected time period and also the average annual warming rate for the selected time period.

**Temperature Change = Ending Temperature − Starting Temperature**

The average annual warming rate is calculated as:

**Average Annual Warming Rate = Temperature Change ÷ Number of Years**

These calculations are performed to enable users to compare long-term projections with warming in shorter time periods.

## 4. Interactive Features

Our visualization includes three main types of interaction.

**Filtering:** Scenarios can be individually turned on and off for all three low, moderate and high emissions scenarios. The chart and Summary Cards will then update to only show the active scenarios.

**Year-range selection:** The start and end year for a time span between 2015 and 2100 can be selected with two sliders. The summary cards are updated automatically for the selected time span and calculate the new temperature change and warming rate.

**Hover exploration:** For a selected year the corresponding position on all selected scenarios is highlighted with a reference line. Moreover, the year and the corresponding projected temperatures of all selected scenarios for this year are displayed in a tooltip on top of the chart.

Together these three features enable comparison. The high-emissions case can be viewed in isolation. A short time frame can be selected to determine the warming rate of a particular case. That case can then be compared with the low-emissions case over the same time period.

## 5. Development Process

We developed the project with the help of Python for data preparation and D3.js for the visualization. We used HTML for the structure of a webpage, CSS for styles and JavaScript for logic of a visualization.

A consistent dataset across all three scenarios was created. A line graph with associated axes was created along with a number of scales. A number of features were implemented including scenario filtering as well as year selection and associated controls. All of the interactions on the page were connected up to the numerical summary cards.

A key challenge when creating the visualization was making sure it worked correctly for all user input. All lines are a function of the selected scenarios, and all highlighted time periods and their respective statistics are a function of the range of years selected by the user.
Both team members contributed equally to the project, collaborating on data preparation, visualization design, implementation, testing, and revisions. We regularly reviewed each other's work and provided feedback to improve the chart's clarity, functionality, and user experience. Most of our time was spent preparing the data, implementing the interactive features, and ensuring that the scenario filters, year sliders, and summary statistics worked together correctly. In total, we spent approximately 20 combined hours developing the project, with 5 hours spent on data preparation, 10 hours on visualization and implementation, and 5 hours on testing and revisions.



## 6. Findings and Takeaways

The visualization illustrates how different emissions pathways produce increasingly different global temperature projections over time.

For low-emissions, the temperatures are increasing at a slow and constant rate and appear to stabilize in the latter half of this century. The moderate case increases at a slower rate than the high case but, in the end, increases in temperature. The high-emissions case has the largest increase in projected global temperatures by the year 2100.

A key point of the comparison of scenarios is that their differences become more apparent the longer the time frame that is considered. The possibility to study differences of development on a shorter time frame is, on the other hand, provided by the interaction with the year-range selection.


