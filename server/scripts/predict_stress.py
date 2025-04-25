# predict_stress.py
import sys
import json
import os
import traceback

try:
    import joblib
    import numpy as np
    import pandas as pd
except ImportError as e:
    print(json.dumps({"error": f"Missing Python dependency: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

try:
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.realpath(__file__))
    model_dir = os.path.join(script_dir, '..', 'model')
    
    print(f"Looking for model files in: {model_dir}", file=sys.stderr)
    
    # Check if model files exist
    model_path = os.path.join(model_dir, 'stress_classifier_model.joblib')
    features_path = os.path.join(model_dir, 'feature_columns.json')
    imputer_path = os.path.join(model_dir, 'imputer.joblib')
    
    if not os.path.exists(model_path):
        print(f"Model file not found at: {model_path}", file=sys.stderr)
        sys.exit(1)
    
    if not os.path.exists(features_path):
        print(f"Feature columns file not found at: {features_path}", file=sys.stderr)
        sys.exit(1)
    
    if not os.path.exists(imputer_path):
        print(f"Imputer file not found at: {imputer_path}", file=sys.stderr)
        sys.exit(1)
    
    # Load model and imputer with joblib
    model = joblib.load(model_path)
    imputer = joblib.load(imputer_path)
    
    # Load feature columns from JSON file
    with open(features_path, 'r') as f:
        feature_columns = json.load(f)
    
    def predict_stress(input_data):
        # Convert input data to DataFrame
        input_df = pd.DataFrame([input_data])
        
        print(f"Input data columns: {input_df.columns.tolist()}", file=sys.stderr)
        print(f"Required columns: {feature_columns}", file=sys.stderr)
        
        # Ensure all columns are present and in the correct order
        for col in feature_columns:
            if col not in input_df.columns:
                input_df[col] = np.nan
        
        input_df = input_df[feature_columns]
        
        # Apply imputer to handle any missing values
        input_df_imputed = pd.DataFrame(imputer.transform(input_df), columns=feature_columns)
        
        # Make prediction
        prediction = model.predict(input_df_imputed)[0]
        probability = model.predict_proba(input_df_imputed)[0].tolist()
        
        return {
            'prediction': int(prediction),
            'probability': probability
        }
    
    if __name__ == "__main__":
        # Read input from stdin
        input_json = sys.stdin.read()
        print(f"Received input: {input_json}", file=sys.stderr)
        
        input_data = json.loads(input_json)
        
        # Make prediction
        result = predict_stress(input_data)
        
        # Return result as JSON
        print(json.dumps(result))

except Exception as e:
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)