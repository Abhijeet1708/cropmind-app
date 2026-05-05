from flask import Blueprint, jsonify

rotation_bp = Blueprint('rotation', __name__)

@rotation_bp.route('/rotation')
def get_rotation():
    return jsonify({})
