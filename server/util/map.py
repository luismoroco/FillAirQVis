import os
import glob
import sys
from typing import List, Dict

from pandas import read_csv, DataFrame

COLS = ["PM25", "PM10", "NO2", "CO", "O3", "SO2"]


def get_metadata(df: DataFrame, idx: int) -> DataFrame:
    return df[df["station_id"] == idx]


def build_map_info(path: str) -> List[Dict]:
    path_station = os.path.join(path, "data", "station.csv")
    df_station = read_csv(path_station)

    files = glob.glob(os.path.join(path, "data", "series", "*.csv"))
    if not files:
        sys.exit()

    res = []
    for path in files:
        df = read_csv(path)

        identifier = path.split("/")[-1].split(".")[0]
        metadata = get_metadata(df_station, int(identifier))

        keys = [
            {"name": key, "percent_nan": df[key].isnull().mean() * 100} for key in COLS
        ]

        res.append(
            {
                "id": identifier,
                "name": str(metadata["name_english"].values[0]),
                "lng": float(metadata["longitude"].values[0]),
                "lat": float(metadata["latitude"].values[0]),
                "len_vars": 6,
                "vars": keys,
            }
        )

    return res
