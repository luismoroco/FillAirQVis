FROM ubuntu:latest
LABEL authors="lmr"

ENTRYPOINT ["top", "-b"]