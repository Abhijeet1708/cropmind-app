from flask import Blueprint, jsonify, current_app, request

rotation_bp = Blueprint('rotation', __name__)

@rotation_bp.route('/rotation')
def get_rotation():
    crop = request.args.get('crop')
    rotation = current_app.config.get('ROTATION', {})
    if crop:
        return jsonify(rotation.get(crop, {}))
    return jsonify(rotation)
