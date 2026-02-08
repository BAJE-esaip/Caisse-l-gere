import React, { useState } from "react";
import "../App.css";
import ScrollContainer from 'react-indiana-drag-scroll';


export default function Caisse() {

    const id_employer = window.electronAPI.getUserId(); ;

    //A garder pour le code de reprendre un ticket
    const [cart, setCart] = useState([]);
    //liste que contient des liste de ticker
    const [pauseticker, setPauseticker] = useState([]);
    //vide le teste quand il est entré
    const [productCode, setProductCode] = useState("");
    // pour les message d'érreur
    const [errorMessage, setErrorMessage] = useState("");

    const [PopupSuppArticle, setPopupSuppArticle] = useState(false);
    const [PopupAttentTicket, setPopupAttentTicket] = useState(false);
    const [PopupReprendreTicket, setPopupReprendreTicket] = useState(false);
    const [PopupSuppArticlecode, setPopupSuppArticlecode] = useState(false);

    //conte ne nombre total d'article dasn le ticket
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    //calcule le prix s'il y a le même article plusieur fois 
    const totalPrice = cart.reduce((sum, item) => sum + item.prix * item.quantity,0);

  //Ajoutr un produit à la liste actuel
  const handleValidateManagerCode = async () => {
    try {
      // requête qui ajout un produit en le cherchant dans la BDD
      const response = await window.electronAPI.checkManagerCode(productCode); 

      if (response.success) {
        setPopupSuppArticlecode(false);
        setPopupSuppArticle(true);
        setProductCode("");
      } else {
        setErrorMessage("Code manager invalide !");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur interne");
    }
  };

  //Ajoutr un produit à la liste actuel
  const handleDelIdProduct = () => {
      setProductCode("");
  };


  //valide un ticket est l'enregistre dasn la BDD
  const handleValidateTicket = async () => {
  if (cart.length === 0) return;
  try {
    const user_id = await window.electronAPI.getUserId(); // await ici
    await window.electronAPI.saveTicket(cart, user_id); 

    setCart([]);
    setPauseticker([]);
    setPopupAttentTicket(false);
    alert("Ticket validé et enregistré !");
  } catch (err) {
    console.error(err);
    setErrorMessage("Erreur lors de l'enregistrement du ticket");
  }
};



  //cliker sur un boutton du paver numérique l'ajoute dans le champs code du produit
  const handleNumPad = (value) => {
    setProductCode((prev) => prev + value);
  };
  //apple une fonction pour ajouter l'élément dans la liste
  const handleEnterText = async () => {
  if (!productCode.trim()) return;

  try {
    // Appel IPC pour récupérer le produit par code barre
    const product = await window.electronAPI.getProductByCode(productCode.trim());

    if (!product) {
      setErrorMessage("Produit non trouvé !");
      setProductCode("");
      return;
    }

    // Vérifie si le produit existe déjà dans le panier
    const existing = cart.find((item) => item.id_produit === product.id_produit);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id_produit === product.id_produit
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setProductCode("");
  } catch (err) {
    console.error(err);
    setErrorMessage("Erreur lors de l'ajout du produit");
  }
};

  //enléve le text du champs code du produit
  const handleDeleteText = () => {
    handleDelIdProduct();
  };
  //refairme les popup
  const handleRetourALaCaisse = () => {
      setPopupSuppArticle(false);
      setPopupSuppArticlecode(false);
  };

  return (
    <div className="p-6 h-screen bg-white border rounded-lg shadow-md flex flex-col">
      <div className="flex-1 min-h-0 border border-gray-300 rounded overflow-y-auto touch-auto scroll-smooth">
      <ScrollContainer className="flex-1 min-h-0 border border-gray-300 rounded">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <tr>
              <th className="text-center py-2 px-2">Produit</th>
              <th className="text-center py-2 px-2">Quantité</th>
              <th className="text-center py-2 px-2">Prix</th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item.id_produit} className="border-t border-gray-300">
                <td className="py-2 px-2 text-left">{item.label}</td>
                <td className="py-2 px-2 text-center">{item.quantity}</td>
                <td className="py-2 px-2 text-right">
                  {(item.prix * item.quantity).toFixed(2)}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollContainer>
      </div>
      

        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Nombre d’article : {totalItems}</span>
              <span>Prix total : {totalPrice}€</span>
            </div>

            <div className="mb-2">
              <p className="block text-sm mb-1">
                Entrée le code du produit :
              </p>
              <input
                type="text"
                className="border p-2 rounded w-32"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="border bg-gray-100 py-2 rounded"
                onClick={handleValidateTicket}
              >
                Valider la commande
              </button>
              <button
                className="border bg-gray-100 py-2 rounded"
                onClick={() => setPopupSuppArticlecode(true)}
              >
                Suppression d’article
              </button>
              <button
                className="border bg-gray-100  py-2 rounded"
                onClick={() => setPopupAttentTicket(true)}
              >
                Mettre le ticket en attente
              </button>
              <button
                className="border bg-gray-100 py-2 rounded"
                onClick={() => setPopupReprendreTicket(true)}
              >
                Reprendre le ticket en attente
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "SUPPRIMER", 0, "ENTRÉE"].map((key) => (
              <button
                key={key}
                className="border bg-gray-100  py-2 bg-white"
                onClick={() => {
                    if (key === "ENTRÉE") {
                      handleEnterText();
                    } else if (key === "SUPPRIMER") {
                      handleDeleteText();
                    } else {
                      handleNumPad(key.toString());
                    }
                  }
                }
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {PopupSuppArticlecode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg flex flex-col gap-4">
              <p className="text-base font-medium">Code manager :</p>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleValidateManagerCode}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Valider
                </button>
                <button
                  onClick={() => setPopupSuppArticlecode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        )}

        
        {PopupSuppArticle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[80vw] h-[80vh] shadow-lg flex flex-col">
              <h2 className="text-lg font-semibold mb-4">
                Suppression d'un article
              </h2>

              <div className="flex-1 min-h-0 border border-gray-300 rounded overflow-y-auto touch-auto scroll-smooth">
                <ScrollContainer className="flex-1 min-h-0 border border-gray-300 rounded">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white border-b border-gray-300 z-10">
                      <tr>
                        <th className="text-center py-2 px-2">Produit</th>
                        <th className="text-center py-2 px-2">Quantité</th>
                        <th className="text-center py-2 px-2">Prix</th>
                        <th className="text-center py-2 px-2">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id_produit} className="border-t border-gray-300">
                          <td className="py-2 px-2 text-left">{item.label}</td>
                          <td className="py-2 px-2 text-center">{item.quantity}</td>
                          <td className="py-2 px-2 text-right">
                            {(item.prix * item.quantity).toFixed(2)}€
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => {
                                setCart((prevCart) =>
                                  prevCart
                                    .map((cartItem) =>
                                      cartItem.id_produit === item.id_produit
                                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                        : cartItem
                                    )
                                    .filter((cartItem) => cartItem.quantity > 0)
                                );
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollContainer>
              </div>
              <div className="mt-4 flex justify-end items-end gap-3">
                <button
                  onClick={() => handleRetourALaCaisse() }
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        )}

        {PopupAttentTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4"> mettre un ticket en attent </h2>
              <p className="mb-6">voulais vous mettre ce ticket en attente?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setPauseticker([...pauseticker, cart]); // Ajoute le ticket actuel à la liste d'attente
                    setCart([]); // Vide le panier après mise en attente
                    setPopupAttentTicket(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  oui
                </button>
                <button onClick={() => setPopupAttentTicket(false)} className="px-4 py-2 bg-blue-500 text-white rounded" > non </button>
              </div>
            </div>
          </div>
        )}

        {PopupReprendreTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Reprendre un ticket</h2>
              <p className="mb-4">Sélectionnez un ticket à reprendre :</p>

              {pauseticker.length === 0 ? (
                <p>Aucun ticket en attente</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {pauseticker.map((ticket, index) => (
                    <button
                      key={index}
                      className="border p-2 rounded hover:bg-gray-100 text-left"
                      onClick={() => {
                        setCart(ticket); // Restaure le ticket dans le panier
                        setPauseticker(pauseticker.filter((_, i) => i !== index)); // Supprime de l'attente
                        setPopupReprendreTicket(false);
                      }}
                    >
                      Ticket {index + 1} - {ticket.length} articles
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPopupReprendreTicket(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
