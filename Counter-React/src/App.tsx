import React, { useState } from 'react';
import './App.css';

import PageSC03CouterDep from "./PageSC03CouterDep";
import PageSC04CounterInc from "./PageSC04CounterInc"
import PageSC05CounterDec from "./PageSC05CounterDec"
import PageSC06CounterFinish from "./PageSC06CounterFinish"


function App() {

  const [currentPage, setCurrentPage] = useState<string>('Counter');

  const [showContDropdown, setShowContDropdown] = useState<boolean>(false);
  const [showSCDropdown, setShowSCDropdown] = useState<boolean>(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setShowContDropdown(false);
    setShowSCDropdown(false);
  };


  return (
    <div className="App">
            <nav className="navbar">

              <div className="dropdown">
                <button className="button" 
                    onClick={() => {setShowSCDropdown(!showSCDropdown);}}>
                  Smart Contracts
                </button>
                {showSCDropdown && (
                  <div className="dropdown-content">

                    <button className="dropdown-button" 
                          onClick={() => {setShowContDropdown(!showContDropdown); }}>
                        Counter
                    </button>
                    {showContDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter')}>
                            Deploy
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter02')}>
                            Increment
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter03')}>
                            Decrement
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter04')}>
                            Finish
                          </button>
                        </div>
                    )}

                  </div>
                )}  
              </div>

            </nav>
      {currentPage === 'Counter' && <PageSC03CouterDep />}
      {currentPage === 'Counter02' && <PageSC04CounterInc />}
      {currentPage === 'Counter03' && <PageSC05CounterDec />}
      {currentPage === 'Counter04' && <PageSC06CounterFinish />}

    </div>
  );
}

export default App;
