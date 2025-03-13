import React from "react";
import { Typography, Box, Divider } from "@mui/material";

const ReportsOutput = ({ data }) => {
  console.log("Data passed to ReportsOutput:", data);
  
  return (
    <Box>
      <Typography variant="h2" gutterBottom style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>
        LICENSE REPORT
      </Typography>
      {data.map((row) => (
        <Box key={row.id} sx={{ mb: 4, p: 2, borderColor: 'gray', borderRadius: 5, justifyContent: 'start' }}>
          <Typography variant="h5" style={{textAlign: 'center'}}>
            Personal Details
          </Typography>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr>
                <th style={headerColumnStyle}><strong>Name</strong></th>
                <th style={headerColumnStyle}><strong>License No</strong></th>
                <th style={headerColumnStyle}><strong>I.D No</strong></th>
                <th style={headerColumnStyle}><strong>Date of Issue</strong></th>
                <th style={headerColumnStyle}><strong>Expiry Date</strong></th>
                <th style={headerColumnStyle}><strong>Gender</strong></th>
                <th style={lastHeaderColumnStyle}><strong>Type</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={columnStyle}>{row.holder_name}</td>
                <td style={columnStyle}>{row.license_number}</td>
                <td style={columnStyle}>{row.national_id}</td>
                <td style={columnStyle}>{row.issue_date}</td>
                <td style={columnStyle}>{row.expiry_date}</td>
                <td style={columnStyle}>{row.gender}</td>
                <td style={lastColumnStyle}>{row.license_type}</td>
              </tr>
            </tbody>
          </table>
          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
    </Box>
  );
};


const headerColumnStyle = {
  borderRight: '1px solid #ddd',
  borderBottom: '2px solid #000', 
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const lastHeaderColumnStyle = {
  ...headerColumnStyle,
  borderRight: 'none',
};


const columnStyle = {
  borderRight: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};


const lastColumnStyle = {
  padding: '8px',
  textAlign: 'left',
};

export default ReportsOutput;
