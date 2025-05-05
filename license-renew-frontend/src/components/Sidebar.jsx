import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
        <div className="sidebar-header"> 
            <img src="/logO1.png" alt="Logo" className="sidebar-logo" />
            
        </div>
        <div className="sidebar-content">
            <div className="sidebar-link">
                <Link to="dashboard"><i class="fa fa-home" aria-hidden="true"></i>&nbsp; Dashboard</Link>
            </div>
            <div className="sidebar-link">
                <Link to="subscription"><i class="fa fa-file-text" aria-hidden="true"></i>&nbsp; Subscriptions</Link>
            </div>
            <div className="sidebar-link">
                <Link to="employees"><i class="fa-solid fa-user-group"></i>&nbsp; Employees</Link>
            </div>
            <div className="sidebar-link">
                <Link to="renewing"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp; Renewals</Link>
            </div>
        </div>

        <div className="sidebar-footer">
            <div className="sidebar-link">
                <Link to="settings"><i class="fa fa-cog fa-fw" aria-hidden="true" />&nbsp; Settings</Link>
            </div>
        </div>
        <style>
            {` 
                .sidebar {
                width: 19rem; 
                background-color: #FFF; 
                color: hsl(224.4, 64.3%, 32.9%);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: auto;
                border-radius: 10px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                overflow: hidden;
                // border-right: 0.1px solid hsl(224.4, 64.3%, 32.9%);

                }

                .sidebar-header,
                .sidebar-footer {
                padding: 1rem;
                border-color: hsl(224.4, 64.3%, 32.9%); 
                }

                .sidebar-header {
                border-bottom: 1px solid;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100px;
                }

                .sidebar-logo {
                height: 100px;        
                max-width: 100%;     
                object-fit: contain;
                }

                .sidebar-content {
                flex: 1;
                padding: 1rem;
                }

                .sidebar-link {
                background-color: #FFF;
                padding: 0.55rem 1rem;
                margin-bottom: 1rem;
                border-radius: 6px;
                transition: box-shadow 0.3s, transform 0.2s;
                }

                .sidebar-link:hover {
                box-shadow: 0 0 10px rgba(0, 102, 204, 0.6);
                transform: translateY(-2px);
                }

                .sidebar-link a {
                color: hsl(224.4, 64.3%, 32.9%);
                text-decoration: none;
                font-weight: 500;
                display: block;
                }


                .sidebar-content a:hover {
                text-decoration: none;
                }

                .sidebar-footer {
                font-weight: 500;
                border-top: 1px solid;
                color: hsl(224.4, 64.3%, 32.9%);
                height: 70px;
                }
            `}
        </style>
    </div>
  );
}
