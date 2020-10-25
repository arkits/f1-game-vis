from app import create_app, sio_app

flask_app = create_app(debug=True)

if __name__ == "__main__":
    sio_app.run(flask_app)
