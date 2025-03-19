from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
import matplotlib.pyplot as plt
import numpy as np

# Input Data
car_data = {
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

predicted_price = {
    "Lower Range": 213962.85,
    "Upper Range": 289479.15
}

# Generate Bar Graph for Car Specifications
plt.figure(figsize=(6, 4))
categories = list(car_data.keys())
values = list(map(str, car_data.values()))
y_pos = np.arange(len(categories))
plt.barh(y_pos, range(len(categories)), color='skyblue')
plt.yticks(y_pos, categories)
plt.xlabel("Features")
plt.title("Car Specifications")
plt.tight_layout()
plt.savefig("bar_chart.png")
plt.close()

# Generate Bar Graph for Depreciation Over Next 5 Years
years = np.array([1, 2, 3, 4, 5])
initial_price = (predicted_price['Lower Range'] + predicted_price['Upper Range']) / 2
depreciation_rate = 0.15  # 15% depreciation per year
prices = initial_price * (1 - depreciation_rate) ** years

plt.figure(figsize=(6, 4))
plt.bar(years, prices, color='lightcoral')
plt.xticks(years, [f"Year {y}" for y in years])
plt.ylabel("Price (INR)")
plt.xlabel("Years in Future")
plt.title("Predicted Depreciation Over Next 5 Years")
plt.tight_layout()
plt.savefig("depreciation_chart.png")
plt.close()

# Generate PDF Report
pdf_filename = "Bar_graph.pdf"
doc = SimpleDocTemplate(pdf_filename, pagesize=letter)
story = []
styles = getSampleStyleSheet()

# Title
story.append(Paragraph("Car Price Prediction Report", styles['Title']))
story.append(Spacer(1, 12))

# Car Details Table
data = [["Attribute", "Value"]] + [[key, str(value)] for key, value in car_data.items()]
table = Table(data, colWidths=[200, 200])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.black)
]))
story.append(table)
story.append(Spacer(1, 12))

# Predicted Price Section
story.append(Paragraph("Predicted Price Range", styles['Heading2']))
story.append(Paragraph(f"Lower Range: {predicted_price['Lower Range']} INR", styles['Normal']))
story.append(Paragraph(f"Upper Range: {predicted_price['Upper Range']} INR", styles['Normal']))
story.append(Spacer(1, 12))

# Add Bar Graph for Car Specifications
story.append(Paragraph("Car Specifications Bar Chart", styles['Heading2']))
story.append(Spacer(1, 12))
story.append(Image("bar_chart.png", width=400, height=250))
story.append(Spacer(1, 12))

# Add Bar Graph for Depreciation
story.append(Paragraph("Depreciation Over Next 5 Years", styles['Heading2']))
story.append(Spacer(1, 12))
story.append(Image("depreciation_chart.png", width=400, height=250))
story.append(Spacer(1, 12))

# Build PDF
doc.build(story)
print(f"PDF Report Generated: {pdf_filename}")
