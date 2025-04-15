import React from "react";
import Dashboard from "../components/Dashboard.jsx";
import { useEffect } from "react";

const Home = () => {

    useEffect(() => {
        
        window.history.pushState(null, "", window.location.href);
    
        const handlePopState = () => {
         
          window.history.pushState(null, "", window.location.href);
        };
    
        window.addEventListener("popstate", handlePopState);
    
        return () => {
          window.removeEventListener("popstate", handlePopState);
        };
      }, []);



    return(
        <>
            <Dashboard />   
        </>
    );
}

export default Home;
