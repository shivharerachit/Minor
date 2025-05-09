import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../NavBar/NavBar.css";

import { SplineScene } from "../Shad/Splite";
import { Card } from "../Shad/Card";
import { Spotlight } from "../Shad/Spotlight";
import { useLocation } from "react-router-dom";

export default function Result() {
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
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        backgroundColor: "#090909",
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <Card className="w-full h-full bg-black/[0.96] fixed overflow-hidden bottom-0">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="yellow"
          />
          <div style={{ minHeight: "100%" }} className="flex h-full ">
            {/* Left content */}
            <div className="  relative z-10 flex flex-col justify-center">
              <h1
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "20px",
                  fontFamily: "Orbitron, sans-serif",
                }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
              >
                AutoValuator
              </h1>
              <h2
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "10px",
                  fontFamily: "Orbitron, sans-serif",
                }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
              >
                Predicted Price: {result.data.price_range}
                {/* ₹30-50 Lakh */}
              </h2>
            </div>

            {/* Right content */}
            <div className="flex-1 relative bottom-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full fixed bottom-0 align-items-center"
              />

              <div style={{ height:"10%", position: "fixed", left: "10px" }}>
                <img
                  src="/src/images/s1-mobile.webp"
                  alt="Car"
                  style={{
                    maxWidth: "60%",
                    margin: "20px",
                    borderRadius: "1rem",
                    boxShadow: "0 0 30px rgba(226, 230, 229, 0.5)",
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          padding: "2rem",
          marginTop: "-100px",
        }}
      >
        <div style={{ flex: "1", textAlign: "center" }}>
          <img
            src="/src/images/s1-mobile.webp"
            alt="Car"
            style={{
              maxWidth: "80%",
              borderRadius: "1rem",
              boxShadow: "0 0 30px rgba(0, 255, 204, 0.5)",
            }}
          />
        </div>
        <div
          style={{
            flex: "1",
            color: "white",
            fontSize: "1.5rem",
            textAlign: "left",
          }}
        >
          <h2>Predicted Price: ₹30-50 Lakh</h2>
          <canvas
            id="graph"
            width="400"
            height="300"
            style={{
              marginTop: "2rem",
              backgroundColor: "#1a1a1a",
              borderRadius: "10px",
            }}
          ></canvas>
        </div>
      </div> */}
    </div>
  );

  //   return (
  //     <div
  //       style={{
  //         backgroundColor: "black",
  //         display: "flex",
  //         flexDirection: "column",
  //         overflow: "hidden",
  //       }}
  //     >
  //       {/* Navbar placed outside the main div */}
  //       {/* <Navbar /> */}

  //       {/* Main content below the Navbar */}
  //       <div
  //         style={{
  //           backgroundColor: "black",
  //           height: "100vh",
  //           display: "flex",
  //           gap: "0px",
  //           padding: "0px",
  //         }}
  //         className="bg-black flex flex-row gap-4 py-14 h-[110vh] w-full"
  //       >
  //         {/* <div
  //                     style={{
  //                         width: "55%",
  //                         display: "flex",
  //                         flexDirection: "column",
  //                         alignItems: "center",
  //                         height: "100%", // Ensure it's full height for proper centering
  //                     }}
  //                     className="min-w-[50%]"
  //                 >
  //                     <h4 style={{ color: "white", textAlign: "center", fontStyle: "italic" }}>
  //                         Download Your Report
  //                     </h4>
  //                     <button
  //                         onClick={handleValuation}
  //                         className="mt-4"
  //                         style={{ marginTop: "30px", height: "50px", color: "white", borderRadius: "15px", backgroundColor: "green" }}
  //                     >
  //                         Get Valuation Report
  //                     </button><br />
  //                     <img src="src\images\s1-mobile.webp" height={"60%"} />
  //                     <h1 style={{ color: "grey", fontFamily: "initial"}}>
  //                         Predicted Price: 30-50 Lakh ₹
  //                     </h1>
  //                 </div> */}

  //         <div style={{ height: "100%", width: "100%" }} className="">
  //           <SplineSceneBasic />
  //         </div>
  //       </div>
  //     </div>
  //   );