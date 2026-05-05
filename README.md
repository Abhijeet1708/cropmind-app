# CropMind

CropMind is an AI-powered smart crop recommendation system. It allows farmers to enter their soil composition and climate data to receive an instantaneous, machine-learning-driven crop recommendation backed by agronomic science, multi-season rotation planning, live weather integration, and a rich analytics dashboard.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Flask, Python |
| ML Pipeline | Scikit-learn (Random Forest), Pandas, Numpy |
| Data Visualization | Matplotlib, Seaborn, Chart.js |
| Frontend | HTML, Jinja2, Vanilla JS, Bootstrap (CDN) |
| Integrations | Open-Meteo API, jsPDF |

## Prerequisites

- Python 3.10+
- Git

## Setup

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd cropmind-app`
3. Create a virtual environment: `python -m venv venv`
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Copy `.env.example` to `.env` and configure your credentials.
7. Run the training pipeline to generate the ML models: `python train.py`
8. Start the Flask application: `python app.py`

## Features

- **Prediction**: Instantaneous crop recommendation based on NPK, temperature, humidity, pH, and rainfall.
- **Weather Auto-fill**: Automatically fetch climate data based on city name.
- **Rotation Planner**: Three-season crop rotation recommendations based on agronomic science.
- **Analytics Dashboard**: Visualizations of your prediction history and soil trends.
- **Crop Encyclopedia**: Detailed information and ideal conditions for 22 supported crops.
- **Admin Panel**: Insights into model performance and dataset statistics.

## Local Testing

After starting the application, navigate to `http://localhost:5000` in your web browser. You can test predictions, view the encyclopedia, and access the admin panel at `/admin`.
