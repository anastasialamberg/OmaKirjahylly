import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">MyApp</Link>
        </div>

        {/* Navigation links */}
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/haku"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Hae kirjoja
            </Link>
          </li>
          <li>
            <Link
              to="/kirjahylly"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sinun kirjahyllysi
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
