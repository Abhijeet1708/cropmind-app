import os
import json
import pickle
from pathlib import Path
from flask import Flask
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Load ML artifacts and knowledge bases at startup
base_dir = Path(__file__).parent
try:
    with open(base_dir / 'models' / 'model.pkl', 'rb') as f:
        app.config['MODEL'] = pickle.load(f)
    with open(base_dir / 'models' / 'scaler.pkl', 'rb') as f:
        app.config['SCALER'] = pickle.load(f)
    with open(base_dir / 'data' / 'crop_knowledge.json', 'r') as f:
        app.config['KNOWLEDGE'] = json.load(f)
    with open(base_dir / 'data' / 'crop_rotation.json', 'r') as f:
        app.config['ROTATION'] = json.load(f)
except Exception as e:
    print(f"Warning: Failed to load application artifacts: {e}")

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
