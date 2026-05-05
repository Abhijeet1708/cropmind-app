import json
import os
from pathlib import Path
from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    metrics = {}
    metrics_path = Path('data/model_metrics.json')
    if metrics_path.exists():
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
    return render_template('index.html', metrics=metrics)
