import React from 'react';


const About = () => {
  return (
    <div>
      <header className="header">
        <div className="LOGOO">ABC Bank</div>
      </header>

      <section className="section about-us">
        <div className="about-content">
          <h2>About us</h2>
          <h2>African Banking Corporation (ABC) Bank Limited</h2>
          <p>We are a financial services institution with 40 years experience that is licensed and regulated by the Central Bank of Kenya. We operate across the country through 11 branches, working with over 55,000 customers to make them <strong>ACHIEVE THE EXTRAORDINARY</strong>.
          We provide reliable and efficient services including banking, stock brokerage, investment advisory, insurance, risk management, and financial services. Regionally we operate in Uganda through our subsidiaries ABC Uganda and ABC Capital Uganda.</p>
        </div>
        <div className="about-image">
          <img src="/EIB-ABC-Bank.jpg" alt="ABC Bank CEO" />
        </div>
      </section>

      <section className="section history">
        <h2>Our History</h2>
        <p>ABC Bank was started in 1981. At the time of its inception, the market lacked options for consumers in terms of personalized service and tailor-made solutions. Consolidated Finance Company Limited opened its doors on 13th of November 1984 to address this market need, with its registered office in Nairobi, Kenya.
        The growth of Consolidated Finance Company Limited was rapid yet steady over the first nine years and by 1994, Consolidated Finance Company Limited became one of the leading Financial Institutions in the country.
        With this solid background and the continued reforms in banking regulations, Consolidated Finance Company had positioned itself to take advantage of these changes to offer more services and support to its customers. Thus, upon gazettement of legislation allowing financial institutions to convert into banks, Consolidated Finance Company immediately transformed, giving rise to African Banking Corporation Limited (ABC), which officially opened its doors in January, 1995.
        ABC Bank has since then expanded to 11 branches across the country, working with individuals, SMEs, corporations, religious and learning institutions, NGOs, and other customers to provide reliable and efficient services.
        Our operating history is over 38 years, enabling our customers to realize their potential while sustainably contributing to communities where they operate and the wider economy. At ABC Bank, we empower you to ACHIEVE THE EXTRAORDINARY.
        Our people are highly skilled and trained professionals dedicated to helping ABC Bank’s customers obtain the products and services that fit their needs and goals.
        ABC Bank has diverse, innovative, and customized financial solutions for businesses, organizations, and retail customers that include: asset finance, trade finance, international and local remittance solutions, invoice discounting, overdrafts, and term loans.
        We have over 50,000 customers with a growing balance sheet that stands at over Kes 33 Billion</p>
      </section>

      <section className="section group-companies">
        <h2>The ABC Bank Group Companies</h2>
        <ul>
          <li><strong>ABC Bank</strong></li>
          <li><strong>ABC Capital Bank – Uganda</strong></li>
          <li><strong>ABC Capital Limited (Stock Brokerage)</strong></li>
          <li><strong>ABC Insurance Brokers Ltd</strong></li>
        </ul>
      </section>  

      <footer className="footer">
        <p>&copy; 2025 ABC Bank  |  ABC Bank is regulated by the Central Bank of Kenya.</p>
      </footer>
      <style>{`
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
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
  font-size: 1.5rem;
  font-weight: bold;
}

.naV ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.naV a {
  color: white;
  text-decoration: none;
}

.internet-banking-btn {
  background-color: #ffa500;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.internet-banking-btn:hover {
  background-color: #ff8c00;
}

.section {
  padding: 2rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.section h2 {
  color: #003366;
}

.section ul {
  padding-left: 20px;
}

.section p {
  text-align: justify;
}

.about-us {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: white;
}

.about-content {
  flex: 1;
  padding: 2rem;
}

.about-content p {
  text-align: justify;
}

.about-image {
  flex: 1;
  padding: 2rem;
  text-align: center;
}

.about-image img {
  max-width: 100%;
  height: 70vh;
  border-radius: 8px;
}

.footer {
  background-color: #003366;
  color: white;
  text-align: center;
  padding: 1rem 0;
}
`}</style>

    </div>
  );
};

export default About;
