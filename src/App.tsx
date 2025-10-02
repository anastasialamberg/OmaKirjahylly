import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookList from "./components/Booklist";
import BookSearch from "./components/BookSearch";
import Homepage from "./components/Homepage";
import EditBook from "./components/EditBook";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./hooks/useAuth";
import { login, register, logout } from "./services/authService";
import bookImage from "./images/undraw_book-lover.svg"

function App() {
  const user = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showMessage = (setter: (v: boolean) => void, value: boolean) => {
    setter(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setter(false), 5000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setErrorMessage(""), 5000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password);
      showMessage(setRegisterSuccess, true);
      setErrorMessage("");
    } catch (error: any) {
      setRegisterSuccess(false);
      showError("Rekisteröityminen epäonnistui. Tarkista sähköposti ja salasana.");
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      showError("Kirjautuminen onnistui!"); 
    } catch (error: any) {
      showError("Kirjautuminen epäonnistui. Tarkista tunnukset.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Kirjaudu sisään</h1>
        {registerSuccess && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
            Rekisteröityminen onnistui! Voit nyt kirjautua sisään.
          </div>
        )}
        {errorMessage && (
          <div className={`px-4 py-2 rounded ${errorMessage.includes("onnistui") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {errorMessage}
          </div>
        )}
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded mt-6"
        />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleLogin(email, password)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Kirjaudu
          </button>
          <button
            onClick={() => handleRegister(email, password)}
            className="bg-green-500 text-white px-4 py-2 rounded "
          >
            Rekisteröidy
          </button>
        </div>
        
        <img src={bookImage} alt="Kirja kuva" className="w-1/3 mt-10" /> 
      </div>
    );
  }
  return (
    <Router>
      <Navbar />
      <div className="p-6">
      <div className="fixed top-0 right-0 p-4 flex items-center space-x-4 bg-white  rounded-md shadow-md z-50">
  <span className="text-gray-600">Kirjautunut: {user.email}</span>
  <button
    onClick={logout}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
  >
    Kirjaudu ulos
  </button>
</div>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/booksearch" element={<BookSearch userId={user.uid} />} />
          <Route path="/booklist" element={<BookList userId={user.uid} />} />
          <Route path="/editbook/:bookId" element={<EditBook userId={user.uid} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
