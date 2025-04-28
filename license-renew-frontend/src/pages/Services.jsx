import React from 'react';


const Services = () => {
  return (
<div className="services-container">
      <h1 className="services-title">Our Services</h1>

      <div className="wave-divider">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,30 C300,90 900,0 1200,30 L1200,00 L0,0 Z" fill="#003366"></path>
        </svg>
      </div>

      <section className="services-grid">
     
        <div className="service-card">
          <h2 className="service-heading">Subscription Management</h2>
          <p className="service-description">
            ABC offers a comprehensive subscription management system that helps departments
            easily track, renew, and maintain their software licenses.
          </p>
          <ul className="service-list">
            <li>Automated Renewal Reminders</li>
            <li>License Status Tracking (Active, Expired, Decommissioned)</li>
            <li>Centralized Subscription Dashboard</li>
            <li>Compliance Monitoring & Reporting</li>
          </ul>
        </div>

        <div className="service-card">
          <h2 className="service-heading">Document Management</h2>
          <p className="service-description">
            Manage all your software license agreements in one place. Our system supports
            document uploads, version control, and secure storage.
          </p>
          <ul className="service-list">
            <li>Upload and Store License Documents</li>
            <li>Version Control for License Agreements</li>
            <li>Secure Document Access</li>
            <li>Historical Record Keeping</li>
          </ul>
        </div>

      
        <div className="service-card">
          <h2 className="service-heading">Notifications and Alerts</h2>
          <p className="service-description">
            Stay proactive with customized email notifications and dashboard alerts.
          </p>
          <ul className="service-list">
            <li>Automated Email Reminders</li>
            <li>Dashboard Status Alerts</li>
            <li>Customizable Notification Settings</li>
            <li>Real-time License Monitoring</li>
          </ul>
        </div>

       
        <div className="service-card">
          <h2 className="service-heading">Analytics and Reporting</h2>
          <p className="service-description">
            Gain valuable insights into your licensing environment with powerful analytics.
          </p>
          <ul className="service-list">
            <li>License Usage Analytics</li>
            <li>Compliance Reports</li>
            <li>Renewal History Tracking</li>
            <li>Department-wise License Breakdown</li>
          </ul>
        </div>
      </section>

    
     
      <style>
        {`.services-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
}

.services-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 50px;
  color: #2c3e50;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.service-card {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.service-heading {
  font-size: 1.75rem;
  margin-bottom: 15px;
  color: #34495e;
}

.service-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

.service-list {
  list-style-type: disc;
  padding-left: 20px;
}

.service-list li {
  margin-bottom: 10px;
  color: #666;
}

/* Wave Divider at Bottom */
.wave-divider {
  margin-top: 60px;
  overflow: hidden;
  height: 100px;
}

.wave-divider svg {
  width: 100%;
  height: 100%;
  display: block;
}
`}
      </style>
    </div>
  );
};

export default Services;
