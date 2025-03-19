import joblib
import pandas as pd
from datetime import datetime

# Load the model
model = joblib.load('Predict-Car-V2.pkl')

current_year = datetime.now().year

# Example data for prediction (replace with your actual data)
df = pd.DataFrame({
    'Brand': ['Maruti'],
    'Model': ['Swift'],
    'M-Year': [current_year - 2020],
    'KM-Driven': [15000],
    'Mileage': [20.0],
    'Engine-Capacity': [1.2],
    'Seats': [5],
    'Fuel-Type': ['Petrol'],
    'Transmission': ['Manual']
})

# df = pd.DataFrame({
#     'Brand': ['Maruti'],
#     'Model': ['Swift'],
#     'M-Year': [current_year - 2020 + 1],
#     'KM-Driven': [15000],
#     'Mileage': [20.0],
#     'Engine-Capacity': [1.2],
#     'Seats': [5],
#     'Fuel-Type': ['Petrol'],
#     'Transmission': ['Manual']
# })


# df = pd.DataFrame({
#     'Brand': ['Maruti'],
#     'Model': ['Alto'],
#     'M-Year': [2014],
#     'KM-Driven': [120000],
#     'Mileage': [19.70],
#     'Engine-Capacity': [0.8],
#     'Seats': [5],
#     'Fuel-Type': ['Petrol'],
#     'Transmission': ['Manual']
# })

# df = pd.DataFrame({
#     'Brand': ['Hyundai'],
#     'Model': ['i20'],
#     'M-Year': [2012],
#     'KM-Driven': [60000],
#     'Mileage': [17.00],
#     'Engine-Capacity': [1.2],
#     'Seats': [5],
#     'Fuel-Type': ['Petrol'],
#     'Transmission': ['Manual']
# })

# Hyundai	i20	2012	60000	Petrol	Manual	17.00	1.2	5	215000



# Perform one-hot encoding
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

l = price - ( price * 0.15 )
h = price + ( price * 0.15 )

print("low = ", l)
print("actual = ", price)
print("high = ",h)