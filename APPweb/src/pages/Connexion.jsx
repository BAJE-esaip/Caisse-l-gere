import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../App.css'

export default function Connexion() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleLogin = async () => {
    try {
      const response = await window.electronAPI.login(username, password)
      if (response.success) {
        window.electronAPI.setUserId(response.user.id_employer);
        navigate("/Caisse")
      } else {
        setErrorMessage(response.message)
      }
    } catch (err) {
      console.error(err)
      setErrorMessage("Erreur lors de la connexion")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300">
      <div className="w-[420px] border-2 border-blue-800 rounded-md p-10 bg-white rounded-xl">
        <div className="mb-6 text-center">
          <h2 className="block mb-5 text-blue-900 font-bold text-2xl">Identifiant</h2>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
            placeholder="Entrez votre identifiant"
            className="w-48 mx-auto block border border-gray-400 rounded px-2 py-1 focus:outline-none rounded-xl"
          />
        </div>
        <div className="mb-8 text-center">
          <label className="block mb-5 text-blue-900 font-bold text-2xl">Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            className="w-48 mx-auto block border border-gray-400 rounded px-2 py-1 focus:outline-none rounded-xl"
          />
        </div>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <div className="text-center">
          <button onClick={handleLogin}
            className="rounded-xl border-gray-400 px-6 py-1 hover:bg-gray-100 font-bold text-white bg-blue-900 text-2xl">
            Connexion
          </button>
        </div>
      </div>
    </div>
  )
}
