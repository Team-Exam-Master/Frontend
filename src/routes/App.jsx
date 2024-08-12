import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header"; 
import Start from "@/components/Start"; 


function App() {
  return (
    <div>
      <Header /> 
      <Start /> 
      <Outlet /> 
    </div>
  );
}

export default App;