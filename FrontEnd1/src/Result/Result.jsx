import React from "react";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Result.css";
import Navbar from "../NavBar/Navbar";

const Result = () => {
  const location = useLocation();
  const result = location.state?.result;
  const carDetails = location.state?.carDetails;

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

  const chartData = result?.data?.depreciation_forecast?.map((item) => ({
    year: item.year,
    minPrice: item.price_range[0],
    maxPrice: item.price_range[1],
    avgPrice: (item.price_range[0] + item.price_range[1]) / 2,
  }));

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(Number(value)))
      return "N/A";

    const num = Number(value);
    const absNum = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    if (absNum >= 10000000) {
      // 1 Crore or more
      return `${sign}${(absNum / 10000000).toFixed(2)} Cr`;
    } else if (absNum >= 100000) {
      // 1 Lakh or more
      return `${sign}${(absNum / 100000).toFixed(2)}L`;
    } else {
      // Less than 1 Lakh
      return `${sign}${new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(absNum)}`;
    }
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(Number(value)))
      return "N/A";
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <>
      <div className="result">
        <Navbar />
        <div className="text-center mb-4">
          <h4>
            <i>Your Car Valuation Report</i>
          </h4>
        </div>
        <div
          className="d-flex flex-row "
          style={{
            width: "100vw",
            height: "95vh",
            padding: 0,
            margin: "10px",
            gap: "0px", 
            justifyContent: "space-evenly",
            alignItems: "flex-start",
          }}
        >
          {result && result.data && (
            <div>
              <div className="mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-3">
                      Valuation Summary
                    </h5>
                    {carDetails && (
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">Vehicle Details:</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="card-text mb-1">
                              <strong>Brand:</strong> {carDetails.Brand}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Model:</strong> {carDetails.Model}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Manufacturing Year:</strong>{" "}
                              {carDetails["M-Year"]}
                            </p>
                            <p className="card-text mb-1">
                              <strong>KM Driven:</strong>{" "}
                              {formatNumber(carDetails["KM-Driven"])} km
                            </p>
                            <p className="card-text mb-1">
                              <strong>Mileage:</strong>{" "}
                              {carDetails.Mileage
                                ? `${formatNumber(carDetails.Mileage)} kmpl`
                                : "N/A"}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="card-text mb-1">
                              <strong>Engine Capacity:</strong>{" "}
                              {carDetails["Engine-Capacity"]
                                ? `${formatNumber(
                                    carDetails["Engine-Capacity"]
                                  )} cc`
                                : "N/A"}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Seats:</strong> {carDetails.Seats}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Fuel Type:</strong>{" "}
                              {carDetails["Fuel-Type"]}
                            </p>
                            <p className="card-text">
                              <strong>Transmission:</strong>{" "}
                              {carDetails.Transmission}
                            </p>
                          </div>
                        </div>
                        <hr />
                      </div>
                    )}
                    <p className="card-text fs-5">
                      <strong>Current Estimated Price:</strong>{" "}
                      {formatCurrency(result.data.current_price)}
                    </p>
                    <p className="card-text fs-5">
                      <strong>Estimated Price Range:</strong>{" "}
                      {result.data.price_range &&
                      Array.isArray(result.data.price_range)
                        ? result.data.price_range
                            .map((p) => formatCurrency(p))
                            .join(" - ")
                        : "N/A"}
                    </p>
                    <div className="text-center mt-4">
                      <button
                        className="btn btn-primary btn-lg px-5"
                        onClick={handleDownload}
                        disabled={!result.pdf_report}
                      >
                        Download Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chartData && chartData.length > 0 && (
            <div style={{ minWidth: "800px" , alignItems: "center"}}>
              <div className="">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-3">
                      Depreciation Forecast
                    </h5>
                    <div style={{ width: "100%", height: 400 }}>
                      <ResponsiveContainer>
                        <LineChart
                          data={chartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                            domain={["dataMin - 100000", "dataMax + 100000"]}
                          />
                          <Tooltip
                            formatter={(value, name) => {
                              const formattedValue = formatCurrency(value);
                              if (name === "minPrice")
                                return [formattedValue, "Min Price"];
                              if (name === "maxPrice")
                                return [formattedValue, "Max Price"];
                              if (name === "avgPrice")
                                return [formattedValue, "Avg Price"];
                              return [formattedValue, name];
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="minPrice"
                            stroke="#8884d8"
                            activeDot={{ r: 6 }}
                            name="Min Price"
                          />
                          <Line
                            type="monotone"
                            dataKey="maxPrice"
                            stroke="#82ca9d"
                            activeDot={{ r: 6 }}
                            name="Max Price"
                          />
                          <Line
                            type="monotone"
                            dataKey="avgPrice"
                            stroke="#ffc658"
                            activeDot={{ r: 6 }}
                            name="Avg Price"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Result;
