import React from 'react'

const About = () => {
  return (
    <div style={{ background: 'linear-gradient(360deg, rgb(253, 253, 253) 0%, rgb(222, 221, 233) 100%)'}}>
        <style>
            {`
                .about {
                    padding: 100px 0 20px 0;
                    text-align: center;
                }

                .about h1 {
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                }

                .about p {
                    font-size: 1rem;
                    color:rgb(15, 14, 14);
                    max-width: 700px;
                    margin: 0 auto;
                }

                .about-info {
                    margin: 2rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: left;
                }

                .logo {
                    width: 25rem;
                    height: 25rem;

                }

                .l {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    object-fit: contain;
                }

                .about-info p {
                    font-size: 1.3rem;
                    margin: 0 2rem;
                    text-align: justify;
                }

                button {
                    border: none;
                    outline: 0;
                    padding: 10px;
                    margin: 2rem;
                    font-size: 1rem;
                    color: white;
                    background-color:rgb(54, 88, 183);
                    text-align: center;
                    cursor: pointer;
                    width: 15rem;
                    border-radius: 4px;
                }
                .More {
                    display: flex;
                    justify-content: center;
                    padding: 100px 0;
                }

                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .card {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 2);
                    padding: 2rem;
                    text-align: center;
                    max-width: 300px;
                    width: 100%;
                }

                .dp {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 2px solid black;
                    object-fit: cover;
                    margin-bottom: 1rem;
                }

                .btn {
                    display: inline-block;
                    background-color: rgb(54, 88, 183);
                    color: white;
                    padding: 8px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-top: 1rem;
                }

                button:hover {
                    background-color:rgb(29, 27, 36);
                }
            `}
        </style>
        <section>
            <div className='about'>
                <h>About Us</h>
                <p style={{ fontWeight: 'bold',fontSize: '20px'}}>ABC Bank Group</p>
                <div className='about-info'>
                    <div>
                        <p>
                        ABC Bank was started in 1981, as a financial institution named Consolidated Finance Company Limited.
                        By 1994, following the gazettement of a legislation allowing financial institutions to convert into banks, Consolidated Finance Company immediately transformed, giving rise to African Banking Corporation Limited (ABC Bank) in 1995.     </p>
                            <button>Read More..</button>
                    </div>
                    <div className='logo'>
                        <img src='/logo.png' className='logo' alt='logo'/>
                    </div>
                </div>
            </div>
            <div className='More'>
                <div className='container'>
                    <div className='card'>
                        <img src='/CEO.jpg' className='dp' alt='logo'/>
                    <h2>Founder/CEO</h2>
                    <p>Suleiman Mashuhuli</p>
                    <a href='https://www.linkedin.com/in/suleiman-mashuhuli/' className='btn'>contacts</a>

                    </div>
                </div>
            </div>
        </section>
      
    </div>
  )
}

export default About
