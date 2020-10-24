from flask import render_template
from src.server import flask_app, sio_app


@flask_app.route("/")
def index():
    return render_template("index.html", async_mode=sio_app.async_mode)