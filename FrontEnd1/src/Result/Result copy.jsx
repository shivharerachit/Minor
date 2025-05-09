import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Result.css";
import Navbar from "../NavBar/Navbar";
// import { SplineSceneBasic } from "../Shad/demo";

const Result = () => {
    const handleValuation = () => {
        fetch('http://localhost:5000/api/vehicle_valuation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Brand: "Hyundai",
                Model: "i20",
                "M-Year": 2018,
                "KM-Driven": 45000,
                Mileage: 18.5,
                "Engine-Capacity": 1.2,
                Seats: 5,
                "Fuel-Type": "Petrol",
                Transmission: "Manual"
            })
        }) 
            .then(response => response.json())
            .then(data => {
                console.log("Current price:", data.data.current_price);
                console.log("Price range:", data.data.price_range);

                if (data.pdf_report) {
                    const byteCharacters = atob(data.pdf_report);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = data.pdf_filename || 'car_valuation.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    alert("PDF not available!");
                }
            })
            .catch(err => console.error("Error:", err));
    };

    return (
        <>
            <div className="result">
                <Navbar />
                <div className="head">
                    <h4><i>Download Your Report</i></h4>
                    {/* <SplineSceneBasic /> */}
                    <button
                        onClick={handleValuation}
                        className="mt-4"
                    >
                        Get Valuation Report
                    </button>
                </div>
            </div>
        </>
    );
};

export default Result;
