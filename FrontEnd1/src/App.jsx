import React from "react";
import Home from "./HomePage/Home";
import { Route , Routes } from "react-router-dom";
import PredictPrice from "./PredictPrice/PredictPrice";
import Result from "./Result/Result";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element= {<Home />} />
      <Route path="/home" element= {<Home />} />
      <Route path="/predictprice" element = {<PredictPrice/>} />
      <Route path="/result" element = {<Result/>} />
    </Routes>
    </>
  );
};

export default App;