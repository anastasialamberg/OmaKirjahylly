import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="min-h-screen ">
      <div className="grid place-items-center min-h-screen px-4">
        <div className="bg-gray-200 rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Tervetuloa kirjahyllyyn
          </h1>
          <p className="text-gray-600 mb-8">
            Hallitse ja selaa kirjoja helposti. Aloita lisäämällä uusi kirja tai
            tutustu kokoelmaasi!
          </p>
          <div className="flex flex-col gap-4">
            <Link
              to="/booksearch"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-xl shadow transition text-center inline-block"
            >
              Lisää uusi kirja
            </Link>

            <Link
              to="/booklist"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-5 rounded-xl shadow transition inline-block"
            >
              Selaa kirjoja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
