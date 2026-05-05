import requests
from flask import Blueprint, jsonify, request

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather')
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    try:
        # Geocoding
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
        geo_res = requests.get(geo_url)
        geo_res.raise_for_status()
        geo_data = geo_res.json()

        if not geo_data.get('results'):
            return jsonify({"error": f"City '{city}' not found"}), 404

        location = geo_data['results'][0]
        lat = location['latitude']
        lon = location['longitude']
        resolved_city = location.get('name', city)

        # Weather Forecast
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation"
        weather_res = requests.get(weather_url)
        weather_res.raise_for_status()
        weather_data = weather_res.json()

        current = weather_data.get('current', {})
        temp = current.get('temperature_2m')
        humidity = current.get('relative_humidity_2m')
        rainfall = current.get('precipitation')

        return jsonify({
            "city": resolved_city,
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rainfall
        })
    except requests.RequestException as e:
        return jsonify({"error": "Failed to connect to weather service"}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500
