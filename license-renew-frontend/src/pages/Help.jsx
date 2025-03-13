import React from 'react'

const Help = () => {
  return (
    <div style={{backgroundColor: '#ADD8E6', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <style>
        {`
          input[type=text], select, textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-top: 6px;
            margin-bottom: 16px;
            resize: vertical;
          }

          input[type=submit] {
            background-color: #04AA6D;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          input[type=submit]:hover {
            background-color: #45a049;
          }

          .container {
            border-radius: 5px;
            background-color: #f2f2f2;
            padding: 20px;
            width: 50%; 
            max-width: 600px; 
          }
        `}
      </style>

      <div className="container">
        <h3 style={{ alignItems: 'center', justifyContent: 'center'}}>Help Corner</h3>
        <form action="form-box">
          <label>First Name</label>
          <input type="text" id="fname" name="firstname" placeholder="Your name.." />

          <label>Last Name</label>
          <input type="text" id="lname" name="lastname" placeholder="Your last name.." />

          <label>Country</label>
          <select id="country" name="country">
            <option value="australia">Kenya</option>
            <option value="canada">Tanzania</option>
            <option value="usa">Somalia</option>
            <option value="australia">Uganda</option>
            <option value="canada">Ethiopia</option>
            <option value="usa">Rwanda</option>
            <option value="australia">Burundi</option>
            <option value="canada">DRC</option>
          </select>

          <label htmlFor="subject">Subject</label>
          <textarea id="subject" name="subject" placeholder="Message.." style={{ height: '150px' }}></textarea>

          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  )
}

export default Help
