import os
from pathlib import Path
from flask import Flask
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Register Blueprints
from routes.main import main_bp
from routes.predict import predict_bp
from routes.rotation import rotation_bp
from routes.weather import weather_bp
from routes.dashboard import dashboard_bp
from routes.encyclopedia import encyclopedia_bp
from routes.admin import admin_bp

app.register_blueprint(main_bp)
app.register_blueprint(predict_bp, url_prefix='/api')
app.register_blueprint(rotation_bp, url_prefix='/api')
app.register_blueprint(weather_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp)
app.register_blueprint(encyclopedia_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
