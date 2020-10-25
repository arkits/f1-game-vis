from flask import render_template, jsonify
from . import blueprint
from .. import sio_app


@blueprint.route("/")
def index():
    return render_template("index.html", async_mode=sio_app.async_mode)


@blueprint.route("/debug")
def get_debug():
    return jsonify({"message": "OK"})
