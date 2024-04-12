import sys
import os

from flask import Flask, jsonify
from flask_cors import CORS

from util.missing import get_series_info
from util.map import build_map_info

# App
app = Flask(__name__)
PATH = os.path.dirname(os.path.abspath(__file__))

# CORS Policy
CORS(app, origins="*")


# Endpoints
@app.route("/vis/info/<string:station>/<string:vari>", methods=["GET"])
def get_station_info(station: str, vari: str):
    if not (station and vari):
        sys.exit()

    info = get_series_info(station, vari, PATH)
    if not info:
        return jsonify(
            {
                "data": {},
                "message": "ERROR",
            }
        )

    return jsonify(
        {
            "data": info,
            "message": "OK",
        }
    )


@app.route("/vis/info/map", methods=["GET"])
def get_map_info():
    res = build_map_info(PATH)
    if not res:
        return jsonify(
            {
                "data": [],
                "message": "ERROR",
            }
        )

    return jsonify({"data": res, "message": "OK"})


if __name__ == "__main__":
    app.run()
