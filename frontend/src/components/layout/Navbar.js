// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">Insurance Portal</div>
        <div className="flex space-x-6">
          <Link to="/groups" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Groups
          </Link>
          <Link to="/members" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Members
          </Link>
          <Link to="#" className="hover:bg-blue-700 px-3 py-2 rounded transition">
            Quotations
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;