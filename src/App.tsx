import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Haku from "./Haku";
import Kirjahylly from "./Kirjahylly";
import Etusivu from "./Etusivu";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Etusivu/>} />
          <Route path="/haku" element={<Haku />} />
          <Route path="/kirjahylly" element={<Kirjahylly/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
