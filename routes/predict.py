import numpy as np
from flask import Blueprint, jsonify, request, render_template, current_app

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return render_template('predict.html')
    
    try:
        data = request.get_json()
        required_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # Validate inputs
        if not data:
            return jsonify({"error": "No input data provided"}), 400
            
        features = []
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing required feature: {feature}"}), 400
            try:
                features.append(float(data[feature]))
            except ValueError:
                return jsonify({"error": f"Feature {feature} must be a number"}), 400
                
        # Inference
        model = current_app.config.get('MODEL')
        scaler = current_app.config.get('SCALER')
        knowledge = current_app.config.get('KNOWLEDGE', {})
        
        if not model or not scaler:
            return jsonify({"error": "ML models not loaded on server"}), 500
            
        features_scaled = scaler.transform([features])
        probs = model.predict_proba(features_scaled)[0]
        max_prob_index = np.argmax(probs)
        predicted_crop = model.classes_[max_prob_index]
        confidence = probs[max_prob_index] * 100
        
        # Feature Importance for this specific prediction is tricky for RF, 
        # but we can return the global feature importances scaled by input to give relative sense,
        # or simply return global feature importances as per typical project scope
        importances = model.feature_importances_
        feature_importance_dict = {feat: float(imp) for feat, imp in zip(required_features, importances)}
        
        crop_info = knowledge.get(predicted_crop, {})
        
        return jsonify({
            "crop": predicted_crop,
            "confidence": float(confidence),
            "description": crop_info.get('description', 'No description available.'),
            "emoji": crop_info.get('emoji', '🌱'),
            "feature_importance": feature_importance_dict
        })
        
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred during prediction"}), 500
