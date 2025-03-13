import React from 'react';

const Contacts = () => {
  return (
    <div style={{ background: 'linear-gradient(360deg, rgb(253, 253, 253) 0%, rgb(182, 180, 202) 100%)', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="responsive-container-block big-container">
        <div className="blueBG"></div>
        <div
          className="responsive-container-block container"
          style={{
            maxWidth: '1080px',
            width: '100%',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '10px',
            textAlign: 'center', 
          }}
        >
          <form className="form-box">
            <div className="container-block form-wrapper">
              <p className="text-blk contactus-head">Reach Out To Us.</p>
              <p className="text-blk contactus-subhead">We value your feedback.</p>
              <div className="responsive-container-block">
                <div className="responsive-cell-block wk-ipadp-6 wk-tab-12 wk-mobile-12 wk-desk-6" id="i10mt">
                  <p className="text-blk input-title">FIRST NAME</p>
                  <input className="input" id="ijowk" name="FirstName" placeholder="Please enter first name..." />
                </div>
                <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                  <p className="text-blk input-title">LAST NAME</p>
                  <input className="input" id="indfi" name="Last Name" placeholder="Please enter last name..." />
                </div>
                <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                  <p className="text-blk input-title">EMAIL</p>
                  <input className="input" id="ipmgh" name="Email" placeholder="Please enter email..." />
                </div>
                <div className="responsive-cell-block wk-desk-6 wk-ipadp-6 wk-tab-12 wk-mobile-12">
                  <p className="text-blk input-title">PHONE NUMBER</p>
                  <input className="input" id="imgis" name="PhoneNumber" placeholder="Please enter phone number..." />
                </div>
                <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-12 wk-ipadp-12" id="i634i">
                  <p className="text-blk input-title">COMMENTS</p>
                  <textarea className="textinput" placeholder="Comment here!..."></textarea>
                </div>
              </div>
              <button className="submit-btn">Submit</button>
            </div>
            <div className="social-media-links">
        
              <a href="https://x.com/ABCBankGroup" id="izldf-2">
                <img className="link-img" src="/twitter.png" alt="Instagram" width='20px' height='20px' />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
