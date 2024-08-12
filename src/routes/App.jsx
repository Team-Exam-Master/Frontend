import React from "react";
import { Outlet } from "react-router-dom";
<<<<<<< HEAD
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
=======

const App = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
>>>>>>> f3bd904861be552ee9d6bd8f64399cef691c312f

export default App;