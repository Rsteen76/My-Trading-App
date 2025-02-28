import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        {/* Add other navigation links here */}
      </ul>
    </nav>
  );
}

export default Navigation;
