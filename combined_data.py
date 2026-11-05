import pandas as pd

ssp126 = pd.read_csv("ssp126_global_temp.csv")
ssp245 = pd.read_csv("ssp245_global_temp.csv")
ssp585 = pd.read_csv("ssp585_global_temp.csv")

combined = pd.concat([ssp126, ssp245, ssp585])

combined.to_csv("all_scenarios.csv", index=False)