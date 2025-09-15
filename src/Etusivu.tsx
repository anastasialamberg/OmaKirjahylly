
function Etusivu() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav>
        <a href="/">Etusivu</a>
        <a href="/kirjahylly">Kirjat</a>
        <a href="/haku">Lisää kirja</a>
      </nav>

      {/* Keskitetty sisältö */}
      <div className="grid place-items-center min-h-screen px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Tervetuloa kirjahyllyyn 📚
          </h1>
          <p className="text-gray-600 mb-8">
            Hallitse ja selaa kirjoja helposti. Aloita lisäämällä uusi kirja tai tutustu kokoelmaasi!
          </p>
          <div className="flex flex-col gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-xl shadow transition text-center" onClick={() => window.location.href = '/haku'}>
              ➕ Lisää uusi kirja
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-5 rounded-xl shadow transition" onClick={() => window.location.href = '/kirjahylly'}>
              📖 Selaa kirjoja
              
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Etusivu;
