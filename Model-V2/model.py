import kagglehub
cardekho_dataset = kagglehub.dataset_download('manishkr1754/cardekho-used-car-data')

print('Data source import complete.')

import numpy as np 
import pandas as pd
import matplotlib.pyplot as plt
import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

df = pd.read_csv('/root/.cache/kagglehub/datasets/manishkr1754/cardekho-used-car-data/versions/2/cardekho_dataset.csv')

df.drop(columns = ['max_power', 'car_name', 'Unnamed: 0', 'seller_type'], inplace = True)

Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1
df = df[~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)]


df.rename(columns={
    'brand': 'Brand',
    'model': 'Model',
    'vehicle_age': 'M-Year',
    'km_driven': 'KM-Driven',
    'fuel_type': 'Fuel-Type',
    'transmission_type': 'Transmission',
    'engine': 'Engine-Capacity',
    'selling_price': 'Price',
    'mileage': 'Mileage',
    'seats': 'Seats'
}, inplace = True)

df['Engine-Capacity'] = df['Engine-Capacity'] * 0.001
df['Engine-Capacity'] = df['Engine-Capacity'].round(1)

df.drop_duplicates(inplace=True)

df.loc[df['Seats'] == 0, 'Seats'] = 5

df['Car_Age'] = 2023 - df['M-Year']
df.drop(columns=['M-Year'], inplace=True)

df = pd.get_dummies(df, dtype=float)

X=df.drop('Price',axis=1)
y=df['Price']

from sklearn.ensemble import ExtraTreesRegressor

model = ExtraTreesRegressor()

print(model.fit(X,y))

print('-'*50)
print('Checking for feature importance')
print('-'*50)

print(model.feature_importances_)

imp_feature = pd.Series(model.feature_importances_, index = X.columns)
imp_feature.nlargest(7).plot(kind = 'barh', color='red')
plt.title('Important Features', fontsize=16)
plt.show()

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import ExtraTreesRegressor, RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, explained_variance_score, r2_score

models = [LinearRegression, RandomForestRegressor, SVR, DecisionTreeRegressor, ExtraTreesRegressor]
modelss = ["LinearRegression", "RandomForestRegressor", "SVR", "DecisionTreeRegressor", "ExtraTreesRegressor"]
mse = []
rmse = []
evs = []
r_square_score = []

for model in models:
    regressor = model().fit(X_train, y_train)
    pred = regressor.predict(X_test)
    mse.append(mean_squared_error(y_true= y_test, y_pred= pred))
    rmse.append(np.sqrt(mean_squared_error(y_true= y_test, y_pred= pred)))
    evs.append(explained_variance_score(y_true= y_test, y_pred= pred))
    r_square_score.append(r2_score(y_true= y_test, y_pred= pred))

ML_model_df=pd.DataFrame({"Model":modelss,
                         "Mean Squarred Error":mse,
                         "Root Mean Squarred Error":rmse,
                         "Explained Variance Score":evs,
                         "R-Sqaure Score(Accuracy)":r_square_score})

ML_model_df.set_index('Model',inplace=True)

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

rf = RandomForestRegressor()
grid_search = RandomizedSearchCV(rf, param_grid, cv=5, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

best_rf = grid_search.best_estimator_
pred_rf = best_rf.predict(X_test)

mse_rf = mean_squared_error(y_test, pred_rf)
r2_rf = r2_score(y_test, pred_rf)

print(f"Tuned Random Forest Mean Squared Error: {mse_rf}")
print(f"Tuned Random Forest R-squared: {r2_rf}")


model_R = RandomForestRegressor()
regressor_R = model_R.fit(X_train, y_train)

pred = regressor_R.predict(X_test)

mse = mean_squared_error(y_test, pred)
r2 = r2_score(y_test, pred)

print(f"Mean Squared Error: {mse}")
print(f"R-squared: {r2}")

model_E = ExtraTreesRegressor()
regressor_E = model_E.fit(X_train, y_train)

pred = regressor_E.predict(X_test)

mse = mean_squared_error(y_test, pred)
r2 = r2_score(y_test, pred)

print(f"Mean Squared Error: {mse}")
print(f"R-squared: {r2}")

from xgboost import XGBRegressor

xgb = XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=6)
xgb.fit(X_train, y_train)
pred_xgb = xgb.predict(X_test)

mse_xgb = mean_squared_error(y_test, pred_xgb)
r2_xgb = r2_score(y_test, pred_xgb)

print(f"XGBoost Mean Squared Error: {mse_xgb}")
print(f"XGBoost R-squared: {r2_xgb}")


pf = pd.DataFrame({
    'Brand': ['Maruti'],
    'Model': ['Alto'],
    'M-Year': [2014],
    'KM-Driven': [120000],
    'Mileage': [19.70],
    'Engine-Capacity': [0.8],
    'Seats': [5],
    'Fuel-Type': ['Petrol'],
    'Transmission': ['Manual']
})

pf_encoded = pd.get_dummies(pf)

import pickle

filename = 'Predict-Car.pkl'
pickle.dump(regressor_R, open(filename, 'wb'))
