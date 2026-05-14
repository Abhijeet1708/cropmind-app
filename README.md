# CropMind AI Platform

CropMind is a production-ready, full-stack crop recommendation web application. It leverages a Flask backend, a Scikit-learn machine learning pipeline, and an interactive frontend built with Bootstrap 5 and Chart.js to deliver precise agricultural insights.

## Features

- **Machine Learning Inference:** Random Forest model providing crop recommendations based on soil (N, P, K, pH) and climate (temperature, humidity, rainfall) data.
- **Live Weather Integration:** Auto-fills climate data using the Open-Meteo API based on user location.
- **Interactive UI:** Asymmetrical Bento grid design with rich animations, transitions, and toast notifications.
- **Data Visualizations:** Dynamic Chart.js elements showing feature importance, and pre-rendered training visualizations in the admin panel.
- **Prediction Reports:** Client-side generation of detailed PDF reports using jsPDF.
- **Result Sharing:** Generates unique tokens and shareable URLs for read-only prediction results.
- **Prediction History:** LocalStorage-based tracking with searching, filtering, sorting, and CSV export.
- **Crop Encyclopedia:** Searchable database of 22 crops with optimal conditions and radar charts.
- **Agronomic Rotation Planner:** 3-season crop rotation suggestions with soil impact rationale.
- **Admin Dashboard:** Secure panel showing system status, dataset metrics, and model training visualizations.

## Technology Stack

- **Backend:** Python 3.13, Flask
- **Machine Learning:** Scikit-learn, Pandas, NumPy
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Data Visualization:** Chart.js, Seaborn/Matplotlib (for training)
- **Utilities:** jsPDF, Open-Meteo API

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Abhijeet1708/cropmind-app.git
cd "Mini-Proj SEM 6"
```

### 2. Create a Virtual Environment
```bash
python -m venv venv
```

Activate the environment:
- **Windows:** `venv\Scripts\activate`
- **macOS/Linux:** `source venv/bin/activate`

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Variables
Copy the `.env.example` file to a new `.env` file and update the variables if necessary.
```bash
cp .env.example .env
```

### 5. Run the Application
```bash
python app.py
```
The application will be available at `http://127.0.0.1:5000`.

## Model Training (Optional)
If you wish to retrain the model or regenerate the data JSON files:

1. Place the raw dataset `crop_recommendation.csv` in the `data/` folder.
2. Run the data generation script to create knowledge bases:
   ```bash
   python generate_data.py
   ```
3. Run the ML pipeline to train the model and generate visualization artifacts:
   ```bash
   python train.py
   ```

## Directory Structure
- `app.py`: Main Flask application entry point.
- `routes/`: Blueprint modules for different app features (predict, weather, admin, etc.).
- `models/`: Pickled ML model and scaler.
- `data/`: JSON knowledge bases and metric files.
- `static/`: CSS, JS, and image assets.
- `templates/`: Jinja2 HTML templates.

## Security Note
The admin panel is secured using a dummy secret for demonstration purposes. In a production environment, implement proper authentication (e.g., Flask-Login, JWT).

## License
MIT License
