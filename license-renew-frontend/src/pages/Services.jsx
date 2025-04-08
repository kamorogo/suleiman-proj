import React from 'react'

const Services = () => {
  return (
    <div style={{ background: 'linear-gradient(360deg, rgb(253, 253, 253) 0%, rgb(222, 221, 233) 100%)'}}>
        <style>
            {`
            .tender-Header {
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
            .Logo1 {
                width: 6rem;
                height: 6rem;

            }
            .Logo2 {
                width: 7rem;
                height: 3.5rem;

            }
            .tender-info {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .containeR {
                display: flex;
                justify-content: center;
                align-items: stretch;
                gap: 40px;
            }

            .cardS {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 2);
                padding: 2rem;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 300px; 
            }

            .DP {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 2px solid black;
                object-fit: cover;
                display: block;
                
            }
            .DP-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .BTN {
                display: inline-block;
                background-color: rgb(54, 88, 183);
                color: white;
                padding: 4px 20px;
                text-decoration: none;
                border-radius: 4px;
                margin-top: auto;
            }

            .BTN:hover {
                background-color:rgb(184, 133, 67);
            }
            .tender-info h2 {
                text-align: center;
                margin-bottom: 20px;
            }

            `}
        </style>
        <div className='tender'>
            <div className='tender-Header'> 
                <div className='Logo1'>
                    <img src='/logO.png' className='Logo1' alt='logo'/>
                </div>
                <div className="Logo2">
                    <img src='/2031.png' className='logo2' alt='logo'/>
                </div>
            </div>
            <h1>Our Services</h1>
            <div className='tender-info'>
                <h2>We Provide Flexible IT Solutions</h2>
                <div className='containeR'>
                
                    <div className='cardS'>
                            <div className='DP-container'>
                                <img src='/web-p.png' className='DP' alt='Logo' />
                            </div>
                        <h2>Web Portals</h2>
                        <p>
                            <ul>
                                <li>Creation of websites</li>
                                <li>Manage Admin </li>
                            </ul>
                        </p>
                        <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='BTN'> &gt;&gt;CLICK ME</a>
                    </div>
                    <div className='cardS'>
                            <div className='DP-container'>
                                <img src='/mobile.webp' className='DP' alt='Logo' />
                            </div>
                        <h2>Mobile Apps</h2>
                        <p>
                            <ul>
                                <li>Android & iOS Develop</li>
                                <li>UI/UX Design</li>
                            </ul>
                        </p>
                        <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='BTN'> &gt;&gt; CLICK ME</a>
                    </div>
                    <div className='cardS'>
                            <div className='DP-container'>
                                <img src='/cloud.jpg' className='DP' alt='Logo' />
                            </div>
                        <h2>Cloud Services</h2>
                        <p>
                            <ul>
                                <li>Cloud Deployment</li>
                                <li>Server Management</li>
                            </ul>
                        </p>
                        <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='BTN'> &gt;&gt; CLICK ME</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Services
