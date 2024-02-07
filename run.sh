#!/usr/bin/env bash

case $1 in
    app)
        if [ -z "$2" ]; then
            echo "usage: $0 [app] [num_workers]"
            exit 1
        fi

        ./venv/bin/python3 -m gunicorn -w "$2" -b 0.0.0.0:5000 index:app
        ;;
    *)
        echo "usage: $0 [app] [num_workers]"
        ;;
esac
