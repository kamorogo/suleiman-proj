import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [successMessage, setSuccessMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('your_service_id', 'your_template_id', form.current, 'your_public_key')
      .then(
        (result) => {
          console.log(result.text);
          setSuccessMessage('Your message has been sent successfully!');
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          setSuccessMessage('Oops! Something went wrong. Please try again.');
        }
      );
  };

  return (
    <div className="contact-page">
      <header className="header">
        <div className="LOGOO">ABC Bank</div>
        <section className="nav">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/sign_in">Sign Out</a></li>
          </ul>
        </section>
      </header>

      <main className="contact-main">
        <section className="contact-section">
            <div className="contact-info">
            <h2>Contact Us</h2>
            <p><strong>Address:</strong> ABC Bank Headquarters, Nairobi, Kenya</p>
            <p><strong>Phone:</strong> (254) 701 700700</p>
            <p><strong>Email:</strong>  talktous@abcthebank.com</p>
            <ul>
              <li><strong>Hours:</strong></li>
              <ul>
                  <li><strong>Monday:</strong> 8:30am - 5:00pm</li>
                  <li><strong>Tuesday:</strong> 8:30am - 5:00pm</li>
                  <li><strong>Wednesday:</strong> 8:30am - 5:00pm</li>
                  <li><strong>Thursday:</strong> 8:30am - 5:00pm</li>
                  <li><strong>Friday:</strong> 8:30am - 5:00pm</li>
                  <li><strong>Saturday:</strong> 8:30am - Noon</li>
                  <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </ul> 
            </div>

          <div className="contact-form">
            <h2>Send us a Message</h2>
            <form ref={form} onSubmit={sendEmail}>
              <input type="text" name="user_name" placeholder="Your Name" required />
              <input type="email" name="user_email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 ABC Bank  |  ABC Bank is regulated by the Central Bank of Kenya.</p>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body, html, .contact-page {
          font-family: Arial, sans-serif;
          height: 100%;
        }
        .header {
          background-color: #003366;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .LOGOO {
          font-size: 1.65rem;
          font-weight: bold;
        }
        .nav ul {
          list-style: none;
          display: flex;
          gap: 1rem;
          
        }
        .nav a {
          color: white;
          text-decoration: none;
        }
        .contact-main {
          min-height: calc(100vh - 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #f9f9f9;
        }
        .contact-section {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          max-width: 1200px;
          width: 100%;
          justify-content: center;
        }
        .contact-info, .contact-form {
          flex: 1 1 350px;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .contact-info h2, .contact-form h2 {
          color: #003366;
          margin-bottom: 1rem;
        }
        .contact-info p {
          margin: 0.7rem 0;
          text-align: justify;
        }
        .contact-form form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact-form input, .contact-form textarea {
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          width: 100%;
        }
        .contact-form textarea {
          min-height: 150px;
        }
        .contact-form button {
          background-color: #003366;
          color: white;
          padding: 0.8rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        .contact-form button:hover {
          background-color: #002244;
        }
        .success-message {
          margin-top: 1rem;
          color: green;
          font-weight: bold;
          text-align: center;
        }
        .footer {
          background-color: #003366;
          color: white;
          text-align: center;
          padding: 1rem 0;
        }
        @media (max-width: 768px) {
          .contact-section {
            flex-direction: column;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;