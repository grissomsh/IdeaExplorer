from flask import Flask
from flask.ext.mongoengine import MongoEngine
from flask.ext.login import LoginManager
from flask.ext.bcrypt import Bcrypt
from flask.ext.cors import CORS

app = Flask(__name__)
app.config["MONGODB_SETTINGS"] = {"DB": "tumblelog"}
app.config["SECRET_KEY"] = "KeepThisS3cr3t"
CORS(app, resources={r'/api/*':{"origins": "*"}} ,allow_headers=['Authorization', 'Content-Type','Access-Control-Allow-Origin'])



db = MongoEngine(app)

login_manager = LoginManager()
login_manager.init_app(app)

flask_bcrypt = Bcrypt(app)

def register_blueprints(app):
    # Prevents circular imports
    from tumblelog.views import posts
    app.register_blueprint(posts)

register_blueprints(app)

from tumblelog import restserver

if __name__ == '__main__':
    app.run()