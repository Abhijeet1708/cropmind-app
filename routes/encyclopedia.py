from flask import Blueprint, render_template, current_app

encyclopedia_bp = Blueprint('encyclopedia', __name__)

@encyclopedia_bp.route('/encyclopedia')
def encyclopedia():
    knowledge = current_app.config.get('KNOWLEDGE', {})
    return render_template('encyclopedia.html', knowledge=knowledge)
