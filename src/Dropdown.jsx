import { useState } from 'react';
import './Dropdown.css';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (animation) => {
    console.log(`Selected animation: ${animation}`);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <div className="menu-icon">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => handleMenuClick('tethered-flow')}>
            Tethered Flow
          </button>
          <button className="dropdown-item" onClick={() => handleMenuClick('particle-system')}>
            Particle System
          </button>
          <button className="dropdown-item" onClick={() => handleMenuClick('wave-motion')}>
            Wave Motion
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
