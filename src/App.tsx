import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import BookList from "./Booklist";
import BookSearch from "./BookSearch";
import Homepage from "./Homepage";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { login, register, logout } from "./authService";

function App() {
  const user = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Kirjaudu sisään</h1>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
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
            onClick={() => login(email, password)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Kirjaudu
          </button>
          <button
            onClick={() => register(email, password)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Rekisteröidy
          </button>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Kirjautunut: {user.email}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Kirjaudu ulos
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/booksearch" element={<BookSearch />} />
          <Route path="/booklist" element={<BookList userId={user.uid} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
