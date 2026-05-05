from flask import Blueprint, jsonify, request

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    return jsonify({"status": "success"})
