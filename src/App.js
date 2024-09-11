import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RentPage from './pages/Rent/RentPage';
import LeasePage from './pages/Lease/LeasePage';
import DashboardPage from './pages/Dashboard/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/rent" element={<RentPage />} />
        <Route path="/lease" element={<LeasePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<RentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
