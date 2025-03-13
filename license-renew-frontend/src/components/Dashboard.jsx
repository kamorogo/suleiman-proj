import React from 'react'
import './Dashboard.css'
import { Link } from 'react-router-dom';


const Dashboard = () => {
  return (
    <div className='dashboard-section'>


                    {/* ---SECTION 1 ---  */}
            <div className='banner-card'>
                    <img src='/SAMPLE10.jpg' className='IMG' alt='IMG' />
                    <div className='banner-text'>
                        <h>Digitika with<font color="orange"> ABC Bank Renew</font></h>
                        <p>We're number one leading bank on all digital services we offer, and here comes the new service
                            with us...<span className='abcrenew'><font color="orange"></font></span>
                        </p>
                    </div>
            </div>
          
            
                    {/* // SECTION 2 ---- */}
            <div className='details-1'>
                <div className='details-1-top'>
                    <div className='details-head'>
                        <h9>HOW CAN WE HELP YOU</h9>
                    </div>
                </div>
                <div className='details-1-content'>
                    <div className='details-card-img'>
                        <img src='/SAMPLE2.jpg' alt='' /><img src='/SAMPLE3.jpg' class='IMG' />
                    </div>
                    <div className='details-text'>
                        <div> 
                            <h9>What we offer to you our <font color="orange">customer</font></h9>
                        </div>
                       
                        <p10>
                            It was our idea since then on our customer who have been suffering
                            on renewals.<br /> 
                            As we've got our Software Development team staff who work productively day and night
                            to ensure our customers get what best for them that will suit their need, finaly ABCRenew was birth.
                            <br />
                            We work toghether and share to our customers on what we've innovated to connect all through our digital services. 
                        </p10>
                    </div>
                </div>
            </div>

            

    

        {/* <header className='header'>
            <img src='/logo.jpg' className='logo' alt='logo'/>
            <nav>
                <input type='text' placeholder='search..' />
                <ul className='nav-link'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li><Link to='/contacts'>Contacts</Link></li>
                    <li><Link to='/services'>Services</Link></li>
                </ul>
            </nav>
        </header> */}
              


                 {/* /----DASHBOARD ---- */}

        <main className='dashboard-main'>
            <div className='dashboard-title'>
                <p>What can I do for you:</p>
                <div className='title-search'>
                    <input type='text' placeholder='search' />
                </div>
            </div>
            <div className='dashboard-container'>
                <div className='right-container'>
                    <div className='dashboard-dp'>
                        <Link to="/reports">
                            <i class="fa fa-file" aria-hidden="true"></i>
                            <p>Reports generation</p>
                        </Link>
                    </div>
                    <div className='dashboard-dp'>
                        <Link to="/viewlicense">
                            <i class="fa fa-eye" aria-hidden="true"></i>
                            <p>View licenses</p>
                        </Link>
                    </div>
                    <div className='dashboard-dp'>
                        <Link to="/notifications">
                            <i class="fa fa-bell" aria-hidden="true"></i>
                            <p>Notifications</p>
                        </Link>
                    </div>
                </div>
                <div className='left-container'>
                <div className='dashboard-dp'>
                        <Link to="/renew">
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                            <p>Renew license</p>
                        </Link>
                    </div>
                    <div className='dashboard-dp'>
                        <Link to="/licenses">
                            <i class="fa fa-tasks" aria-hidden="true"></i>
                            <p>Manage licenses</p>
                        </Link>
                    </div>
                    <div className='dashboard-dp'>
                        <Link to="/help">
                            <i class="fa fa-question-circle" aria-hidden="true"></i>
                            <p>Help</p>
                        </Link>
                    </div>
                </div>
            </div>       
        </main>



                   {/* // SECTION 5 ---- */}

        <div class="container-fluid text-center">
            <h1 class="headinginfo">Why Choose ABC Bank</h1>
            <p id="parainfo" style={{fontStyle: "italic"}}>
                "ABC Bank is the ideal partner for your License Renewal Tracking needs that could offer several benefits"
            </p>
        </div>
        <div class="container-fluid" id="newcard">
            <div class="card-grid">
                <div class="card">
                    <i class="fas fa-user-clock"></i>
                    <h5 class="card-title">Customer Support</h5>
                    <p class="card-text">
                    ABC Bank's customer service could offer dedicated support to help resolve any issues with payments, processing or system integration.
                    </p>
                </div>
                <div class="card">
                    <i class="fa-solid fa-key"></i>
                    <h5 class="card-title">Data Security</h5>
                    <p class="card-text">
                    ABC Bank's security infrastructure could ensure data protection through encryption, secure storage and compliance with regulations.
                    </p>
                </div>
                <div class="card">
                    <i class="fa fa-credit-card"></i>
                    <h5 class="card-title">Reliable Payment Process</h5>
                    <p class="card-text">
                    ABC Bank could offer secure and seamless payment gateways, ensuring that payments for license renewals can be processed easily and efficiently.
                    </p>
                </div>
                <div class="card">
                    <i class="fas fa-brain"></i>
                    <h5 class="card-title">Expert Employees</h5>
                    <p class="card-text">
                    ABC Bank has experience dealing with corporate clients or industries that require license tracking, their expertise could provide added value.
                    </p>
                </div>
                <div class="card">
                    <i class="fas fa-coins"></i>
                    <h5 class="card-title">Integrated Finacial Services</h5>
                    <p class="card-text">
                    ABC Bank could provide integrations with financial tools and reports, making the tracking and management of licenses and their renewals smoother for businesses.
                    </p>
                </div>
                <div class="card">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <h5 class="card-title">Scalable Solutions</h5>
                    <p class="card-text">
                    ABC Bank’s infrastructure could scale accordingly, ensuring that as your license renewal system handles more data, payments and reminders.
                    </p>
                </div>
            </div>
        </div>


                {/* ----OUR CLIENTS---- */}

        <div className='client-page'>
            <div className='client-info'>
                <div className='client-head'>
                    <h9>Our <font color='orange'>Clients & Partners</font></h9>
                </div>
                <div className='client-partners'>
                    <div className='partner-boxes'>
                        <img src='/company.jpg' className='com' alt='com' />
                        <h1>Companies</h1>
                    </div>
                    <div className='partner-boxes'>
                        <img src='/startups.jpg' className='start' alt='start' />
                        <h1>Startups</h1>
                    </div>
                    <div className='partner-boxes'>
                        <img src='individuals.webp' className='ind' alt='ind' />
                        <h1>Individuals</h1>
                    </div>
                </div>
                <div className='client-image'>
                    <img src='/coop.jpg' className='cooop' alt='coop'/>
                    <img src='/Equity Bank Logo.png' className='equity' alt='equity'/>
                    <img src='/GTCO_logo.png' className='gtco' alt='gtco'/>
                    <img src='/NSAK.jpg' className='nsak' alt='nsak'/>
                    <img src='/nai.png' className='nai' alt='nai'/>
                </div>
            </div>
        </div>


        <div class="contact-form">
            <h2>Reach Out!</h2>
            <form>
                <input type="text" name="from_name" placeholder="Full Name" aria-label="Full Name" required />
                <input type="email" name="email" placeholder="Email Address" aria-label="Email Address" required />
                <input type="text" name="subject" placeholder="Subject" aria-label="Subject" required />
                <textarea name="message" placeholder="Message" rows="4" aria-label="Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>  
        </div>



                {/* ---FOOTER--- */}

        <footer className='footer'>
            <div class="footer-custom">
                <div class="footer-container">
                    <div class="footer-section">
                        <div class="footer-content">
                            <div class="footer-about">
                                <div class="footer-logo">
                                    <h3>Amazingly Better Choice</h3>
                                </div>
                                <p1>
                                    One-stop shop for innovative financial solutions across Kenya and Uganda.
                                </p1>
                            </div>
                                <ul class="social-content">
                                    <li class="social-tem"><a href="https://www.facebook.com/abcbankgroup/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook"></i></a></li>
                                    <li class="social-tem"><a href="https://www.x.com/ABCBankGroup" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i></a></li>
                                    <li class="social-tem"><a href="https://www.instagram.com/abcbankgroup/" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a></li>
                                    <li class="social-tem"><a href="https://www.youtube.com/@abcbankgroup" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube"></i></a></li>
                                    <li class="social-tem"><a href="talk2us@abcthebank.com" target="_blank" rel="noopener noreferrer"><i class="fa fa-envelope"></i></a></li>
                                </ul>
                        </div>
                        <div class="footer-content">
                          <h4>Quick Links</h4>
                            <ul class="footer-nav">
                                <li><a href="#">HOME</a></li>
                                <li><a href="/about">ABOUT</a></li>
                                <li><a href="/contacts">CONTACTS</a></li>
                                <li><a href="/services">SERVICES</a></li>
                            </ul>
                        </div>
                        <div class="footer-content">
                                <h4>Contact</h4>
                            <ul class="footer-contact">
                                <li class="femail">
                                    <i class="bx bx-envelope" ></i>
                                  <span>talktous@abcthebank.com</span>
                                </li>
                                <li class="fphone">
                                  <i class='bx bx-phone'></i>
                                  <span>Tel: (254)  701 700700</span>
                                </li>
                                <li class="flocation">
                                  <i class='bx bxs-map'></i>
                                  <span>Woodvale Grove, Westlands
                                      <br />P.O Box 3610-00800 Nairobi, Kenya</span>
                                </li>
                            </ul>
                        </div>
                 </div>
                    <p >ABC Bank Group © Copyright rights reserved</p>
                </div>
           </div>
        </footer>


    </div>
  )
}

export default Dashboard
