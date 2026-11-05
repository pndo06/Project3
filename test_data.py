import xarray as xr
import numpy as np
import pandas as pd

url = "gs://cmip6/CMIP6/ScenarioMIP/NOAA-GFDL/GFDL-ESM4/ssp585/r1i1p1f1/Amon/tas/gr1/v20180701"

print("Connecting to temperature data...")

ds = xr.open_zarr(
    url,
    consolidated=True,
    storage_options={"token": "anon"},
    chunks=None
)

print("Successfully connected!")
print(ds)

print("\nTemperature variable:")
print(ds["tas"])

# Latitude weights
weights = np.cos(np.deg2rad(ds["lat"]))

# Global average temperature
global_temp = ds["tas"].weighted(weights).mean(dim=("lat", "lon"))

print("\nGlobal average temperature:")
print(global_temp)

# Convert Kelvin to Celsius
global_temp_c = global_temp - 273.15

print("\nGlobal average temperature in Celsius:")
print(global_temp_c)

# Annual average temperature
annual_temp = global_temp_c.groupby("time.year").mean("time")

print("\nYearly global average temperature:")
print(annual_temp)

# Convert to a df
df = annual_temp.to_dataframe(name="global_temp_c").reset_index()

print("\nAnnual temperature table:")
print(df.head())

# Remove height column
df = df.drop(columns=["height"])

# Climate scenario
df["scenario"] = "SSP5-8.5"

# Save the data as a CSV file
df.to_csv("ssp585_global_temp.csv", index=False)