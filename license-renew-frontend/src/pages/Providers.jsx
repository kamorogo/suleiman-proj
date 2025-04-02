import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Providers.css";

const providers = ["Safaricom", "Airtel", "Telkom", "Microsoft", "Google", "Amazon", "Meta", "Apple", "Vodacom", "IBM"];
const images = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"];

export default function Providers() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (!selectedProvider) {
      alert("Please select a provider!");
      return;
    }
    navigate(`/manage?provider=${encodeURIComponent(selectedProvider)}`);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="head">
        <div className="logo">
          <img src="logO1.png" className="logo" alt="logo" />
        </div>
        <div className="nav-links">
          <a href="/help" className="help">Help</a>
          <a href="#" className="logout">Logout</a>
        </div>
      </header>

      <main className="main-content">
        <div className="box left-box">
          <div className="slideshow-container">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index}`}
                className={`slide ${index === currentIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        
        <div className="box right-box">
          <h2 className="box-title">You're almost there!</h2>
          <select 
            className="provider-select"
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="">Select a provider</option>
            {providers.map((provider, index) => (
              <option key={index} value={provider}>{provider}</option>
            ))}
          </select>
          <button 
            className="next-button"
            onClick={handleNext}
          >
            Next
          </button>


          <p className="additional-text">Ensure you have selected the correct provider before proceeding.
            <br/>
            <strong>Note</strong>: By accessing our site, always verify that the browser on your web site address starts with https and see a closed padlock icon in the address bar. Click the padlock to see more information and details about the security certificate.
          </p>
         
          <br/>
          <text><a href="https://www.abcthebank.com/multichannel-online-banking-general-terms-conditions/">Terms and Conditions</a></text>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-p">
        &copy; 2025 ABC Group. All rights reserved.
      </footer>
    </div>
  );
}
