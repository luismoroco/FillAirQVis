import os
import logging

from flask import Flask
from dotenv import load_dotenv

load_dotenv()

__all__ = ["AppFactory"]


class AppFactory:
    __app: Flask
    __version: str

    def __init__(self, version: str = "0.0.1") -> None:
        self.__version = version
        self.__app = Flask(__name__)

    @property
    def app(self) -> Flask:
        return self.__app

    def setup_config(self) -> None:
        logging.basicConfig(
            level=logging.DEBUG,
            format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
        )

        self.__app.config['DEBUG'] = os.getenv("DEBUG")
        self.__app.config['PORT'] = os.getenv("FLASK_PORT")
