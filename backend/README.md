# Backend

## About

This is a simple micro-service written in Flask. The goal of this web-server is to ingest the UDP packets emitted by the games and broadcast them via Socket.IO. The UDP packets are parsed/unpacked with the [f1-2020-telemetry](https://pypi.org/project/f1-2020-telemetry/) library.

## Getting Started

- Setup your Python virtual environment.
```
python3 -m venv .venv   
source .venv/bin/activate 
```

- Install the dependencies
```
pip install -r requirements.txt     
```

- For the best performance, run the server using gunicorn

```bash
gunicorn --worker-class eventlet -w 1 src.server:flask_app
```