"""
Machine Learning Pipeline for CropMind.
Loads data, performs EDA, trains a Random Forest model, evaluates performance,
generates visualizations, and saves artifacts for the Flask application.
"""

import json
import pickle
from pathlib import Path

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support

def set_seeds():
    """Set random seeds for reproducibility."""
    np.random.seed(42)

def load_data(data_path: Path) -> pd.DataFrame:
    """Load the crop recommendation dataset."""
    print("--- LOADING DATA ---")
    df = pd.read_csv(data_path)
    print(f"Data loaded successfully from {data_path}")
    return df

def perform_eda(df: pd.DataFrame):
    """Perform Exploratory Data Analysis and print summary statistics."""
    print("\n--- EXPLORATORY DATA ANALYSIS ---")
    print(f"Dataset Shape: {df.shape}")
    print("\nData Types:")
    print(df.dtypes)
    print("\nMissing Values:")
    print(df.isnull().sum())
    print("\nDescriptive Statistics:")
    print(df.describe())
    print("\nCrop Class Distribution:")
    class_dist = df['label'].value_counts()
    print(class_dist)
    print("\nCrop Class Percentages:")
    print(df['label'].value_counts(normalize=True) * 100)

def generate_visualizations(df: pd.DataFrame, model: RandomForestClassifier, feature_names: list, charts_dir: Path):
    """Generate and save data visualization charts."""
    print("\n--- GENERATING VISUALIZATIONS ---")
    charts_dir.mkdir(parents=True, exist_ok=True)
    sns.set_theme(style="whitegrid")

    # 1. Class Distribution
    plt.figure(figsize=(10, 8))
    sns.countplot(y='label', data=df, order=df['label'].value_counts().index, palette='viridis')
    plt.title('Crop Class Distribution')
    plt.xlabel('Count')
    plt.ylabel('Crop')
    plt.tight_layout()
    plt.savefig(charts_dir / 'class_distribution.png', dpi=150)
    plt.close()

    # 2. Correlation Heatmap
    plt.figure(figsize=(10, 8))
    corr = df[feature_names].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Feature Correlation Heatmap')
    plt.tight_layout()
    plt.savefig(charts_dir / 'correlation_heatmap.png', dpi=150)
    plt.close()

    # 3. Nutrient Boxplot Grid
    fig, axes = plt.subplots(3, 1, figsize=(12, 15))
    sns.boxplot(x='label', y='N', data=df, ax=axes[0], palette='Greens')
    axes[0].set_title('Nitrogen Distribution by Crop')
    axes[0].tick_params(axis='x', rotation=45)
    
    sns.boxplot(x='label', y='P', data=df, ax=axes[1], palette='Oranges')
    axes[1].set_title('Phosphorus Distribution by Crop')
    axes[1].tick_params(axis='x', rotation=45)
    
    sns.boxplot(x='label', y='K', data=df, ax=axes[2], palette='Blues')
    axes[2].set_title('Potassium Distribution by Crop')
    axes[2].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig(charts_dir / 'nutrient_boxplot.png', dpi=150)
    plt.close()

    # 4. Climate Scatter Plot
    plt.figure(figsize=(12, 8))
    sns.scatterplot(data=df, x='temperature', y='rainfall', hue='label', palette='tab20', alpha=0.7)
    plt.title('Rainfall vs Temperature by Crop')
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.savefig(charts_dir / 'climate_scatter.png', dpi=150)
    plt.close()

    # 5. Feature Importance
    plt.figure(figsize=(10, 6))
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    sorted_features = [feature_names[i] for i in indices]
    sns.barplot(x=importances[indices], y=sorted_features, palette='mako')
    plt.title('Random Forest Feature Importance')
    plt.xlabel('Importance Score')
    plt.tight_layout()
    plt.savefig(charts_dir / 'feature_importance.png', dpi=150)
    plt.close()
    
    print(f"Visualizations saved to {charts_dir}")

def train_and_evaluate(df: pd.DataFrame, models_dir: Path, data_dir: Path):
    """Train the model, evaluate it, and save artifacts."""
    print("\n--- TRAINING MODEL ---")
    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[features]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=20,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    print("\n--- EVALUATING MODEL ---")
    y_pred = model.predict(X_test_scaled)
    
    print("\nClassification Report:")
    report = classification_report(y_test, y_pred)
    print(report)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Overall Accuracy: {accuracy:.4f}")
    
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='macro')
    
    # Save artifacts
    print("\n--- SAVING ARTIFACTS ---")
    models_dir.mkdir(parents=True, exist_ok=True)
    with open(models_dir / 'model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open(models_dir / 'scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    metrics = {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "num_classes": len(y.unique())
    }
    
    with open(data_dir / 'model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print("Saved model.pkl, scaler.pkl, and model_metrics.json")
    
    return model, features

def main():
    """Main execution function."""
    set_seeds()
    base_dir = Path(__file__).parent
    data_path = base_dir / 'data' / 'crop_recommendation.csv'
    models_dir = base_dir / 'models'
    data_dir = base_dir / 'data'
    charts_dir = base_dir / 'static' / 'img' / 'charts'
    
    df = load_data(data_path)
    perform_eda(df)
    model, features = train_and_evaluate(df, models_dir, data_dir)
    generate_visualizations(df, model, features, charts_dir)
    print("\nTraining pipeline complete.")

if __name__ == "__main__":
    main()
