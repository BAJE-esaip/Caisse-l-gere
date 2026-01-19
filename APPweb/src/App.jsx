import { Routes, Route } from "react-router-dom";
import Caisse from "./pages/Caisse";
import Connexion from "./pages/Connexion";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Connexion />} />
      <Route path="/Caisse" element={<Caisse />} />
    </Routes>
  );
}
