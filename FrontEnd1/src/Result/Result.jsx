import React from "react";
import { useLocation } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Result.css";
import Navbar from "../NavBar/Navbar";

const Result = () => {
    const location = useLocation();
    const result = location.state?.result; 

    const handleDownload = () => {
        if (result?.pdf_report) {
            const byteCharacters = atob(result.pdf_report);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = result.pdf_filename || "car_valuation.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            alert("PDF report is not available!");
        }
    };

    return (
        <>
            <div className="result">
                <Navbar />
                <div className="head">
                    <h4><i>Download Your Report</i></h4>
                    {result ? (
                        <div className="result-details">
                            <p><strong>Current Price:</strong> {result.data.current_price}</p>
                            <p><strong>Price Range:</strong> {result.data.price_range}</p>
                        </div>
                    ) : (
                        <p>No result data available.</p>
                    )}
                    <button
                        className="mt-4"
                        onClick={handleDownload}
                    >
                        Get Valuation Report
                    </button>
                </div>
            </div>
        </>
    );
};

export default Result;
