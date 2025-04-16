import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      alert("Please create subscription!");
      navigate("/create");
      return;
    }
    navigate(`/manage?provider=${encodeURIComponent(selectedProvider)}`);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="HEAd">
        <div className="logo">
          <img src="logO1.png" className="logo" alt="logo" />
        </div>
        <div className="nav-links">
          <a href="/help" className="help">Help</a>
          <a href="/sign_in" className="logout">Logout</a>
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
      <style jsx>
        {
          `
          .container {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }

            header {
              background-color: white;
              border-bottom: 1px solid blue;
              padding: 5px 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .logo {
              font-size: 1.5rem;
              font-weight: bold;
            }
            
            .nav-links a {
              margin-left: 16px;
              text-decoration: none;
            }
            
            .help {
              color: blue;
            }
            
            .logout {
              color: red;
            }
            .box {
              margin-top: 0;
            }

          .main-content {
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding: 24px;
              width: 80%; 
              margin: 0 auto; 
              height: 70vh; 
            }
            

            .left-box {
              width: 70%; 
              height: 100%; 
              min-height: 300px;
              display: flex;
              align-items: center;
              padding: 16px;
              overflow: hidden;
            }

            .right-box {
              width: 60%; 
              height: 100%; 
              border: 1px solid #ccc;
              padding: 16px;
              min-height: 300px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .additional-text {
              margin-top: 10px;
              font-size: 0.9rem;
              color: #666;
              text-align: justify;
              line-height: 22px;
            }
            
          .slideshow-container {
            position: relative;
            width: 80%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }

            
          .slide {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
          }

          .slide.active {
            opacity: 1;
          }

            .box-title {
              font-size: 1.2rem;
              margin-bottom: 50px;
            }
            
            .provider-select {
              width: 100%;
              padding: 4px;
              border: 1px solid #ccc;
              margin-top: 10px;
            }
            
            .next-button {
              width: 30%;
              background-color: blue;
              color: white;
              padding: 10px;
              right: 20px;
              margin-top: 10px;
              border: none;
              cursor: pointer;
              border-radius: 5px;
              justify-content: right;
              align-items: right;
            }
            
            .next-button:hover {
              background-color: darkblue;
            }

            .footer-p {
              background-color: #333;
              color: white;
              text-align: center;
              padding: 8px;
              margin-top: auto;
            }
            @media (max-width: 1024px) {
              .main-content {
                flex-direction: column;
                height: auto;
              }

              .left-box,
              .right-box {
                width: 100%;
                margin-bottom: 24px;
              }

              .next-button {
                width: 100%;
              }

              .box-title {
                text-align: center;
              }
            }
              
            @media (max-width: 600px) {
              header {
                flex-direction: column;
                align-items: flex-start;
              }

              .nav-links {
                margin-top: 10px;
                display: flex;
                gap: 12px;
              }

              .slideshow-container {
                width: 100%;
                height: auto;
              }

              .slide {
                height: auto;
              }

              .additional-text {
                font-size: 0.8rem;
              }
            }
          `
        }
      </style>
    </div>
  );
}
