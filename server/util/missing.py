import os
from typing import List, Any

from pandas import read_csv, DataFrame
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.stattools import adfuller
import numpy as np
from sklearn.preprocessing import StandardScaler


METHOD_FILL = "DELETE"


def get_trend(x: List[Any], y: List[Any]) -> float:
    # lr = LinearRegression()
    # lr.fit(x, y)

    slope, _ = np.polyfit(x, y, 1)

    # return lr.coef_[0]
    return slope

def get_p_value(x: DataFrame) -> float:
    return adfuller(x)[1]


def get_series_info(station_id: str, key: str, path: str) -> dict:
    path = os.path.join(path, "data", "series", f"{station_id}.csv")

    # Load CSV
    df = read_csv(path, usecols=["time", key], parse_dates=["time"], index_col=["time"])

    # Processing
    if METHOD_FILL == "DELETE":
        df.dropna(inplace=True)

    # x = df.index.values.reshape(-1, 1)
    scaler = StandardScaler()

    x = [idx for idx, _ in enumerate(df[key].values)]
    y = df[key].values

    # y = scaler.fit_transform(y.reshape(-1, 1))

    # print(f"TREND VALUES X=[{x}]")
    # print(f"TREND VALUES Y=[{y}]")

    return {
        "method": METHOD_FILL,
        "trend": "{:.9f}".format(get_trend(np.array(x), y)),
        "p_value": "{:.9f}".format(get_p_value(y)),
        "from_d": df.index.min(),
        "to_d": df.index.max(),
    }
