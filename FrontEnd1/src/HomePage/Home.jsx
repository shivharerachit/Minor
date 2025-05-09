import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import Navbar from "../NavBar/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="main">
            <Navbar />
                <div className="heading">
                    <h4><i>💰"AutoValuator - Get the Best Price Before You Sell!"</i></h4>
                    <p>AutoValuator empowers you to make informed decisions by providing accurate and data-driven car price predictions. Whether you're buying or selling, get the best value estimation instantly and confidently</p>
                    <button type="button" className="btn btn-outline-primary" onClick={() => navigate("/predictprice")}>Estimate Now</button>
                </div>
            </div>
        </>
    );
};

export default Home;