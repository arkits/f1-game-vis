from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit
from loguru import logger

async_mode = "eventlet"

app = Flask(__name__)
socketio = SocketIO(app, async_mode=async_mode)


@app.route("/")
def index():
    return render_template("index.html", async_mode=socketio.async_mode)


@socketio.on("test_ping")
def ping_pong():
    emit("test_pong")


@socketio.on("connect")
def test_connect():
    logger.info("Client connected sid={}", request.sid)
    emit("aux_event", {"message": "Hello from the other side"})


@socketio.on("disconnect")
def test_disconnect():
    logger.info("Client disconnected sid={}", request.sid)


if __name__ == "__main__":
    socketio.run(app, debug=True)