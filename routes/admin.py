import os
import json
from pathlib import Path
from flask import Blueprint, render_template, request, session, redirect, url_for, current_app

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/', methods=['GET', 'POST'])
def admin_index():
    if request.method == 'POST':
        secret = request.form.get('secret')
        # Check against dummy ADMIN_SECRET
        if secret == os.environ.get('ADMIN_SECRET', 'cropmind_admin'):
            session['is_admin'] = True
            return redirect(url_for('admin.admin_index'))
        else:
            return render_template('admin_login.html', error="Invalid Secret Key")
            
    if not session.get('is_admin'):
        return render_template('admin_login.html')
        
    metrics = current_app.config.get('METRICS', {})
    
    # Try to load full classification report if available (mocked or real)
    report = {}
    try:
        with open(Path(__file__).parent.parent / 'data' / 'model_metrics.json', 'r') as f:
            full_metrics = json.load(f)
            # In a real app we'd load the full report. For now, use the metrics we have.
            # We will mock the table in the template using overall metrics if full report is absent.
    except Exception:
        pass

    return render_template('admin.html', metrics=metrics)

@admin_bp.route('/logout')
def logout():
    session.pop('is_admin', None)
    return redirect(url_for('main.index'))
