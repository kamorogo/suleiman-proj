import React from 'react'

const Services = () => {
  return (
    <div style={{ background: 'linear-gradient(360deg, rgb(253, 253, 253) 0%, rgb(222, 221, 233) 100%)'}}>
        <style>
            {`
            .tender-header {
                height: 10vh;
                margin: 0.0rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .tender h1 {
                font-size: 1.3rem;
                padding: 0px;
                text-align: center;
            }
            .logo1 {
                width: 6rem;
                height: 6rem;

            }
            .logo2 {
                width: 7rem;
                height: 3.5rem;

            }
            .tender-info {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .container {
                display: flex;
                justify-content: center;
                align-items: stretch;
                gap: 40px;
            }

            .cards {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 2);
                padding: 2rem;
                text-align: center;
                max-width: 300px;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 300px; 
            }

            .dp {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 2px solid black;
                object-fit: cover;
                display: block;
                
            }
            .dp-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .btn {
                display: inline-block;
                background-color: rgb(54, 88, 183);
                color: white;
                padding: 4px 20px;
                text-decoration: none;
                border-radius: 4px;
                margin-top: auto;
            }

            .btn:hover {
                background-color:rgb(184, 133, 67);
            }
            .tender-info h2 {
                text-align: center;
                margin-bottom: 20px;
            }

            `}
        </style>
        <div className='tender'>
            <div className='tender-header'> 
                <div className='logo1'>
                    <img src='/logO.png' className='logo1' alt='logo'/>
                </div>
                <div className="logo2">
                    <img src='/2031.png' className='logo2' alt='logo'/>
                </div>
            </div>
            <h1>Our Services</h1>
            <div className='tender-info'>
                <h2>We Provide Flexible IT Solutions</h2>
                <div className='container'>
                
                    <div className='cards'>
                            <div className='dp-container'>
                                <img src='/web-p.png' className='dp' alt='logo' />
                            </div>
                        <h3>Web Portals</h3>
                        <p>
                            <ul>
                                <li>Creation of websites</li>
                                <li>Manage Admin </li>
                            </ul>
                        </p>
                        <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='btn'> &gt;&gt;CLICK ME</a>
                    </div>
                    <div className='cards'>
                            <div className='dp-container'>
                                <img src='/mobile.webp' className='dp' alt='logo' />
                            </div>
                        <h3>Mobile Apps</h3>
                        <p>
                            <ul>
                                <li>Android & iOS Develop</li>
                                <li>UI/UX Design</li>
                            </ul>
                        </p>
                        <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='btn'> &gt;&gt; CLICK ME</a>
                    </div>
                    <div className='cards'>
                            <div className='dp-container'>
                                <img src='/cloud.jpg' className='dp' alt='logo' />
                            </div>
                        <h3>Cloud Services</h3>
                        <p>
                            <ul>
                                <li>Cloud Deployment</li>
                                <li>Server Management</li>
                            </ul>
                        </p>
                        <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='btn'> &gt;&gt; CLICK ME</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Services
