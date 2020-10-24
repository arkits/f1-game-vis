from src.server import sio_app
from flask_socketio import emit
from flask import request
from loguru import logger
from src.domain.packet_emitter import telemetry_emitter

from threading import Lock

telemetry_emitter_thread = None
telemetry_emitter_thread_lock = Lock()


@sio_app.on("test_ping")
def ping_pong():
    emit("test_pong")


@sio_app.on("connect")
def test_connect():
    logger.info("Client connected sid={}", request.sid)
    emit("aux_event", {"message": "Namaskar Mandali 🙏"})

    global telemetry_emitter_thread
    with telemetry_emitter_thread_lock:
        if telemetry_emitter_thread is None:
            emit("aux_event", {"message": "Starting Telemetry Emitter!"})
            telemetry_emitter_thread = sio_app.start_background_task(telemetry_emitter)


@sio_app.on("disconnect")
def test_disconnect():
    logger.info("Client disconnected sid={}", request.sid)