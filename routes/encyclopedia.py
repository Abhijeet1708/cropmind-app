from flask import Blueprint

encyclopedia_bp = Blueprint('encyclopedia', __name__)

@encyclopedia_bp.route('/encyclopedia')
def encyclopedia():
    pass
