from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import matplotlib.pyplot as plt
import numpy as np

def generate_depreciation_graph(model_year, lower_price, higher_price):
    years = np.arange(model_year, 2025)  # Assuming current year is 2025
    depreciation_rate = 0.12  # Assuming 12% annual depreciation
    lower_values = [lower_price * ((1 - depreciation_rate) ** (year - model_year)) for year in years]
    higher_values = [higher_price * ((1 - depreciation_rate) ** (year - model_year)) for year in years]
    
    plt.figure(figsize=(7, 4))
    plt.plot(years, lower_values, label='Lower Estimate', marker='o')
    plt.plot(years, higher_values, label='Higher Estimate', marker='o')
    plt.xlabel('Year')
    plt.ylabel('Estimated Price (INR)')
    plt.title('Depreciation of Vehicle Price')
    plt.legend()
    plt.grid()
    plt.savefig("depreciation.png")
    plt.close()

def generate_pdf_report(input_data, price_range, filename="Car_Price_Report.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, height - 50, "Car Price Report")
    
    c.setFont("Helvetica", 12)
    y_position = height - 100
    for key, value in input_data.items():
        c.drawString(50, y_position, f"{key}: {value}")
        y_position -= 20
    
    lower_price, higher_price = price_range
    y_position -= 20
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y_position, "Predicted Price Range:")
    c.setFont("Helvetica", 12)
    y_position -= 20
    c.drawString(50, y_position, f"Lower Range: INR {lower_price:.2f}")
    y_position -= 20
    c.drawString(50, y_position, f"Upper Range: INR {higher_price:.2f}")
    y_position -= 50
    
    generate_depreciation_graph(input_data["M-Year"], lower_price, higher_price)
    
    try:
        img = ImageReader("depreciation.png")
        img_width = 400
        img_height = 250
        x_position = (width - img_width) / 2  # Centering the graph
        c.drawImage(img, x_position, y_position - img_height, width=img_width, height=img_height)
    except Exception as e:
        print("Error adding image:", e)
    
    c.save()
    print(f"PDF report generated: {filename}")

if __name__ == "__main__":
    input_data = {
        "Brand": "Hyundai",
        "Model": "i20",
        "M-Year": 2012,
        "KM-Driven": 60000,
        "Mileage": 17.00,
        "Engine-Capacity": 1.2,
        "Seats": 5,
        "Fuel-Type": "Petrol",
        "Transmission": "Manual"
    }
    
    price_range = (213962.85, 289479.15)
    generate_pdf_report(input_data, price_range)