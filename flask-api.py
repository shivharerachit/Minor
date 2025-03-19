from flask import Flask, request, jsonify
import joblib
import pandas as pd
from datetime import datetime

current_year = datetime.now().year


def process_car_data(brand, model, year, km_driven, mileage, engine_capacity, seats, fuel_type, transmission):
    # Load the model
    model = joblib.load('Predict-Car-V2.pkl')
    # print("YEAR : ", year)
    print("CURRENT_YEAR : ", current_year - year)
    df = pd.DataFrame({
            'Brand': [brand],
            'Model': [model],
            'M-Year': [current_year - year],
            'KM-Driven': [km_driven],
            'Mileage': [mileage],
            'Engine-Capacity': [engine_capacity],
            'Seats': [seats],
            'Fuel-Type': [fuel_type],
            'Transmission': [transmission]
        })
    
    df_encoded = pd.get_dummies(df)

    training_columns = []

    with open('column_names.txt', 'r') as f:
        for line in f:
            training_columns.append(line.strip())


    # Reindex the encoded DataFrame to match the training columns
    df_encoded = df_encoded.reindex(columns=training_columns, fill_value=0)


    # Make predictions
    predictions = model.predict(df_encoded)

    price = int(predictions[0])

    # l = price - ( price * 0.15 )
    # h = price + ( price * 0.15 )

    # print("low = ", l)
    # print("high = ",h)

    # return [price, l, h]
    return price





# def process_car_data(brand, model, year, km_driven, mileage, engine_capacity, seats, fuel_type, transmission):
#     # Dummy function to process input data (replace with actual logic)
#     result = {
#         "Brand": brand,
#         "Model": model,
#         "Manufacturing Year": year,
#         "Kilometers Driven": km_driven,
#         "Mileage": mileage,
#         "Engine Capacity": engine_capacity,
#         "Seats": seats,
#         "Fuel Type": fuel_type,
#         "Transmission": transmission,
#         "Estimated Value": f"${round(float(year) * 0.8 * (1 - (int(km_driven)/100000)), 2)}"
#     }
#     return result

app = Flask(__name__)

@app.route('/process_car', methods=['POST'])
def process_car():
    try:
        data = request.json
        required_fields = ['Brand', 'Model', 'M-Year', 'KM-Driven', 'Mileage', 'Engine-Capacity', 'Seats', 'Fuel-Type', 'Transmission']
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # response = process_car_data(
        #     data['Brand'], data['Model'], data['M-Year'], data['KM-Driven'],
        #     data['Mileage'], data['Engine-Capacity'], data['Seats'], data['Fuel-Type'], data['Transmission']
        # )

        response = []

        for i in range(0, 6):
            response.append(process_car_data(data['Brand'], data['Model'], data['M-Year'] - i, data['KM-Driven'], data['Mileage'], data['Engine-Capacity'], data['Seats'], data['Fuel-Type'], data['Transmission']))

        # print(response[0][0])
        
        l = float(response[0]) - ( float(response[0]) * 0.15 )
        h = float(response[0]) + ( float(response[0]) * 0.15 )

        response.append({'l':l, 'h':h})

        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)