import React from "react" ;
import "./PredictPrice.css" ;
import Navbar from "../NavBar/Navbar";
import Form from "../Form/Form";

const PredictPrice = () => {
    return (
       <>
       <div className="predictprice">
       <Navbar />
       <Form/>
       <footer className="footer">
        <p>©️copyright@AutoValuator2024||All Rights Reserved</p>
       </footer>
       </div>
       </>
    );
};

export default PredictPrice ;