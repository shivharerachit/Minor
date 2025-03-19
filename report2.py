from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
# from reportlab.lib.utils import ImageReader
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import matplotlib.pyplot as plt
import numpy as np

def generate_depreciation_graph(model_year, lower_price, higher_price):
    years = np.arange(model_year, 2025)
    depreciation_rate = 0.12
    lower_values = [lower_price * ((1 - depreciation_rate) ** (year - model_year)) for year in years]
    higher_values = [higher_price * ((1 - depreciation_rate) ** (year - model_year)) for year in years]
    
    # plt.figure(figsize=(5, 3))
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
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    elements.append(Paragraph("Car Price Report", styles["Title"]))
    # elements.append(Spacer(1, 12)) 
    
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
    # elements.append(Spacer(1, 12))
    
    lower_price, higher_price = price_range
    elements.append(Paragraph(f"Predicted Price Range: INR {(lower_price/100000):.2f} L - INR {(higher_price/100000):.2f} L", styles["Heading2"]))
    # elements.append(Paragraph(f"Lower Range: INR {lower_price:.2f}", styles["Normal"]))
    # elements.append(Paragraph(f"Upper Range: INR {higher_price:.2f}", styles["Normal"]))
    # elements.append(Spacer(1, 12))
    
    generate_depreciation_graph(input_data["M-Year"], lower_price, higher_price)
    # generate_pie_chart(input_data["Fuel-Type"], input_data["Transmission"])
    
    elements.append(Paragraph("Depreciation Graph:", styles["Heading2"]))
    # elements.append(Spacer(1, 6))
    # elements.append(ImageReader("depreciation.png"))
    image = Image("depreciation.png", width=400, height=230)
    image.hAlign = 'CENTER'
    elements.append(image)
    
    # elements.append(Spacer(2, 13))
    
    doc.build(elements)
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