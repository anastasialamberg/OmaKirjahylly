import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50 h-14">
      <div className="container mx-auto flex items-center h-full">
       
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Etusivu
            </Link>
          </li>
          <li>
            <Link
              to="/booksearch"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Hae kirjoja
            </Link>
          </li>
          <li>
            <Link
              to="/booklist"
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
