from flask import Blueprint, render_template, current_app

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
def dashboard():
    metrics = current_app.config.get('METRICS', {})
    return render_template('dashboard.html', metrics=metrics)
