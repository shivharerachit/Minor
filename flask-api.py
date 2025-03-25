from flask import Flask, request, jsonify, send_file, make_response
import joblib
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
from datetime import datetime
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from io import BytesIO
import json  
import base64


current_year = datetime.now().year
matplotlib.use('Agg')


def process_car_data(brand, model, year, km_driven, mileage, engine_capacity, seats, fuel_type, transmission):
    model = joblib.load('Predict-Car-V2.pkl')
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

    df_encoded = df_encoded.reindex(columns=training_columns, fill_value=0)
    predictions = model.predict(df_encoded)
    price = int(predictions[0])

    l = price - ( price * 0.04 )
    h = price + ( price * 0.04 )
    return [price, l, h]


def generate_depreciation_graph(model_year, price_range):
    years = np.arange(current_year, current_year + len(price_range))
    lower_values = [price_range[i][1]/100000 for i in range(len(price_range))]
    higher_values = [price_range[i][2]/100000 for i in range(len(price_range))]

    plt.figure(figsize=(7, 4))
    plt.plot(years, lower_values, label='Lower Estimate', marker='o')
    plt.plot(years, higher_values, label='Higher Estimate', marker='o')
    plt.xlabel('Year')
    plt.ylabel('Estimated Price in Lakh (INR)')
    plt.title('Depreciation of Vehicle Price')
    plt.legend()
    plt.grid()

    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    plt.close()
    img_buffer.seek(0)
    return img_buffer

def generate_pdf_report(input_data, price_range, filename="Car_Price_Report.pdf"):
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    elements.append(Paragraph("Car Price Report", styles["Title"]))
    table_data = [["Attribute", "Value"]] + [[k, str(v)] for k, v in input_data.items()]
    table = Table(table_data, colWidths=[150, 250])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(table)
    lower_price = price_range[0][1]
    higher_price =  price_range[0][2]

    elements.append(Paragraph(f"Predicted Price Range: INR {(lower_price/100000):.2f} L - INR {(higher_price/100000):.2f} L", styles["Heading2"]))
    
    elements.append(Paragraph("Depreciation Graph:", styles["Heading2"]))

    img_buffer = generate_depreciation_graph(input_data["M-Year"], price_range)

    image = Image(img_buffer, width=400, height=230)
    image.hAlign = 'CENTER'
    elements.append(image)

    elements.append(Spacer(1, 24))
    elements.append(Paragraph(f"Report generated on {datetime.now().strftime('%d %B %Y')}", styles["Italic"]))
    elements.append(Paragraph("Note: This valuation is an estimate based on current market trends.", styles["Italic"]))
    
    doc.build(elements)
    pdf_buffer.seek(0)
    return pdf_buffer


def generate_combined_response(input_data):
    """Generate both JSON data and PDF report"""
    try:
        # Generate predictions for current year and next 5 years
        price_predictions = []
        for i in range(0, 6):
            price_predictions.append(process_car_data(
                input_data['Brand'], input_data['Model'], input_data['M-Year'] - i, 
                input_data['KM-Driven'], input_data['Mileage'], input_data['Engine-Capacity'], 
                input_data['Seats'], input_data['Fuel-Type'], input_data['Transmission']
            ))
        
        # Prepare JSON response data
        json_data = {
            "status": "success",
            "data": {
                "current_price": price_predictions[0][0],
                "price_range": [price_predictions[0][1], price_predictions[0][2]],
                "depreciation_forecast": [
                    {
                        "year": current_year + i,
                        "price_range": [price_predictions[i][1], price_predictions[i][2]]
                    } for i in range(len(price_predictions))
                ]
            }
        }
        
        # Generate PDF report
        pdf_buffer = generate_pdf_report(input_data, price_predictions)
        
        return json_data, pdf_buffer
    
    except Exception as e:
        raise e


app = Flask(__name__)

@app.route('/process_car', methods=['POST'])
def process_car():
    try:
        data = request.json
        required_fields = ['Brand', 'Model', 'M-Year', 'KM-Driven', 'Mileage', 'Engine-Capacity', 'Seats', 'Fuel-Type', 'Transmission']
        
        if not all(field in data for field in required_fields):
            return jsonify({
                "status": "error",
                "message": "Missing required fields",
                "required_fields": required_fields
                }), 400
        
        # response = process_car_data(
        #     data['Brand'], data['Model'], data['M-Year'], data['KM-Driven'],
        #     data['Mileage'], data['Engine-Capacity'], data['Seats'], data['Fuel-Type'], data['Transmission']
        # )
        # input_data = {
        #     "Brand": "Hyundai",
        #     "Model": "i20",
        #     "M-Year": 2012,
        #     "KM-Driven": 60000,
        #     "Mileage": 17.00,
        #     "Engine-Capacity": 1.2,
        #     "Seats": 5,
        #     "Fuel-Type": "Petrol",
        #     "Transmission": "Manual"
        # }

        # response_data = []
        
        # for i in range(0, 6):
        #     response_data.append(process_car_data(
        #         data['Brand'], data['Model'], data['M-Year'] - i, 
        #         data['KM-Driven'], data['Mileage'], data['Engine-Capacity'], 
        #         data['Seats'], data['Fuel-Type'], data['Transmission']))
        


        # pdf_buffer = generate_pdf_report(data, price_predictions)

        # pdf_response = make_response(send_file(
        #     pdf_buffer,
        #     as_attachment=True,
        #     download_name=f"Car_Valuation_{data['Brand']}_{data['Model']}.pdf",
        #     mimetype='application/pdf'
        # ))

        # response.headers['Access-Control-Allow-Origin'] = '*'
        json_data, pdf_buffer = generate_combined_response(data)
        
        # Create a multipart response
        response = make_response()
        
        # First part: JSON data
        response.data = json.dumps(json_data).encode('utf-8')
        response.headers['Content-Type'] = 'application/json'
        
        # Second part: PDF file
        response.headers.add('X-PDF-File', 'true')
        response.headers.add('Content-Disposition', 
                           f'attachment; filename=Car_Valuation_{data["Brand"]}_{data["Model"]}.pdf')
        response.headers.add('X-Content-Type-Options', 'nosniff')
        response.headers.add('Access-Control-Expose-Headers', 'Content-Disposition,X-PDF-File')
        
        # Alternatively, you can send the PDF as a base64 encoded string in the JSON
        # and let the frontend handle it
        pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
        json_data['pdf_report'] = pdf_base64
        
        return jsonify(json_data)

        
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)