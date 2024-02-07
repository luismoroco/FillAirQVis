from src.server.common.factory import AppFactory
from . import __version__

__all__ = ["app"]


app_factory = AppFactory(__version__)
app_factory.setup_config()

app = app_factory.app
