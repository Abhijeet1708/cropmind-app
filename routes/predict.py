from flask import Blueprint, jsonify, request, render_template

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return render_template('predict.html')
    return jsonify({"status": "success"})
