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
              className="bg-[rgb(49,111,159)] !text-white font-semibold py-3 px-6 rounded-xl border border-slate-300 shadow-md hover:shadow-lg hover:bg-[rgb(39,96,140)] transform hover:-translate-y-0.5 transition-all duration-200"
            >
              📖 Lisää uusi kirja
            </Link>

            <Link
              to="/booklist"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              🔍 Selaa kirjoja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
