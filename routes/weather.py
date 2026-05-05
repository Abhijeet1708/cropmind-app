from flask import Blueprint, jsonify, request

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather')
def get_weather():
    return jsonify({})
