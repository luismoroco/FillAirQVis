from typing import Optional

__all__ = ["FillAirQVisBaseException"]


class FillAirQVisBaseException(Exception):
    def __init__(self, output: Optional[str] = None) -> None:
        super().__init__(output)
