import { useNavigate } from "react-router-dom";
import '../App.css'

export default function Connexion(){

  
  // chnager la fonction navigate par une fonction qui vérifie les information entré
  const navigate = useNavigate();

    return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300">
      <div className="w-[420px] border-2 border-blue-800 rounded-md p-10 bg-white rounded-xl">
        <div className="mb-6 text-center">
          <h2 className="block mb-5 text-blue-900 font-bold text-2xl">identifiant</h2>
          <input
            type="text"
            className="w-48 mx-auto block border border-gray-400 rounded px-2 py-1 focus:outline-none rounded-xl"
          />
        </div>
        <div className="mb-8 text-center">
          <label className="block mb-5 text-blue-900 font-bold text-2xl">Mots de passe</label>
          <input
            type="password"
            className="w-48 mx-auto block border border-gray-400 rounded px-2 py-1 focus:outline-none rounded-xl"
          />
        </div>
        <div className="text-center">
          <button onClick={() => navigate("/Caisse")} className=" rounded-xl border-gray-400 rounded px-6 py-1 hover:bg-gray-100 font-bold text-white bg-blue-900 text-2xl">
            Connexion
          </button>
        </div>
      </div>
    </div>
  );
}