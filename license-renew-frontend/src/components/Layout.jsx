import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="admin-layout">
        <Sidebar />
        <div className="main-content">
                <Header />
            <div className="page-content">
                <Outlet />
            </div>
        </div>
        <style>
            {`.admin-layout {
                display: flex;
                height: 100vh;
                padding: 0.5rem 0.5rem 0 0; 
                box-sizing: border-box;
                gap: 1rem;
                background-color: hsl(214.3 94.6% 92.7%); 
                }

                .main-content {
                display: flex;
                flex-direction: column;
                flex: 1;
                border-radius: 10px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.0);
                overflow: hidden;
                }

                .page-content {
                flex: 1;
                padding: 2rem;
                overflow: auto;
                background-color: hsl(214.3 94.6% 92.7%); 
                }
            `}
        </style>
    </div>
  );
}
