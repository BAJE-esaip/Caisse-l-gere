import React, { useState } from "react";
import "../App.css";
import ScrollContainer from 'react-indiana-drag-scroll';

//A remplacer par une requête à l'API ou BDD
const initialProducts = [
  { id: 1, name: "Croissant", price: 2.5 },
  { id: 2, name: "Baguette", price: 1 },
  { id: 3, name: "vin", price: 1 },
  { id: 4, name: "chocolat", price: 1 },
  { id: 5, name: "champagne", price: 1 },
  { id: 6, name: "vélo", price: 1 },
  { id: 7, name: "voiture", price: 1 },
  { id: 8, name: "orange", price: 1 },
  { id: 9, name: "bonbon", price: 1 },
  { id: 10, name: "viande", price: 1 },
  { id: 11, name: "Baguette", price: 5 },
  { id: 12, name: "vin", price: 5 },
  { id: 13, name: "chocolat", price: 5 },
  { id: 14, name: "champagne", price: 5 },
  { id: 15, name: "vélo", price: 5 },
  { id: 16, name: "voiture", price: 5 },
  { id: 17, name: "orange", price: 5 },
  { id: 18, name: "bonbon", price: 5 },
  { id: 19, name: "viande", price: 5 },

];


export default function Caisse() {

    const [PopupSuppArticle, setPopupSuppArticle] = useState(false);
    const [PopupAttentTicket, setPopupAttentTicket] = useState(false);
    const [PopupReprendreTicket, setPopupReprendreTicket] = useState(false);

  //A garder pour le code de reprendre un ticket
  const [cart, setCart] = useState([
    { ...initialProducts[0], quantity: 2 },
    { ...initialProducts[1], quantity: 1 },
    { ...initialProducts[2], quantity: 2 },
    { ...initialProducts[3], quantity: 1 },
    { ...initialProducts[4], quantity: 2 },
    { ...initialProducts[5], quantity: 1 },
    { ...initialProducts[6], quantity: 2 },
    { ...initialProducts[7], quantity: 1 },
    { ...initialProducts[8], quantity: 2 },
    { ...initialProducts[9], quantity: 1 },
    { ...initialProducts[10], quantity: 2 },
    { ...initialProducts[11], quantity: 1 },
    { ...initialProducts[12], quantity: 2 },
    { ...initialProducts[13], quantity: 1 },
    { ...initialProducts[14], quantity: 2 },
    { ...initialProducts[15], quantity: 1 },
    { ...initialProducts[16], quantity: 2 },
    { ...initialProducts[17], quantity: 1 },
    { ...initialProducts[18], quantity: 2 },
  ]);
  //liste que contient des liste de ticker
  const [pauseticker, setPauseticker] = useState([
  ]);
  //vide le teste quand il est entré
  const [productCode, setProductCode] = useState("");
  //conte ne nombre total d'article dasn le ticket
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  //calcule le prix s'il y a le même article plusieur fois 
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity,0);
  //Ajoutr un produit à la liste actuel
  const handleAddProduct = () => {
    //recherche un produit via son ID a garder pour la pour repemdre un ticket en cours + recherche de produit
    const product = initialProducts.find(
      (p) => p.id === Number(productCode)
    );
    if (product) {
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
      setProductCode("");
    }
  };

  //Ajoutr un produit à la liste actuel
  const handleDelIdProduct = () => {
      setProductCode("");
  };
  //enlerve un aticle de la liste à améliorer car supprime quand il y en plusieur
  const handleDelete = () => {
    setCart(cart.slice(0,-1));
  };
  //enlerve tout les article du tableau
  const handleALLDelete = () => {
    //requête de l'envois les commande faite pour l'API ou la BDD
    setCart(cart.slice(0,0));
  };
  //cliker sur un boutton du paver numérique l'ajoute dans le champs code du produit
  const handleNumPad = (value) => {
    setProductCode((prev) => prev + value);
  };
  //apple une fonction pour ajouter l'élément dans la liste
  const handleEnterText = () => {
    handleAddProduct();
  };
  //enléve le text du champs code du produit
  const handleDeleteText = () => {
    handleDelIdProduct();
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
              <tr key={item.id} className="border-t border-gray-300">
                <td className="py-2 px-2 text-left">{item.name}</td>
                <td className="py-2 px-2 text-center">{item.quantity}</td>
                <td className="py-2 px-2 text-right">
                  {(item.price * item.quantity).toFixed(2)}€
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
                onClick={handleALLDelete}
              >
                Valider la commande
              </button>
              <button
                className="border bg-gray-100 py-2 rounded"
                onClick={() => setPopupSuppArticle(true)}
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
                      </tr>
                    </thead>

                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} className="border-t border-gray-300">
                          <td className="py-2 px-2 text-left">{item.name}</td>
                          <td className="py-2 px-2 text-center">{item.quantity}</td>
                          <td className="py-2 px-2 text-right">
                            <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded" >
                            Supprimer
                          </button>
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollContainer>
                </div>

            {/* <div className="flex-1 min-h-0 border border-gray-300 rounded overflow-y-auto">
              <ScrollContainer className="flex-1 min-h-0 border border-gray-300 rounded">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white border-b z-10">
                    <tr>
                      <th className="py-2 px-2 text-center">Produit</th>
                      <th className="py-2 px-2 text-center">Quantité</th>
                      <th className="py-2 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="py-2 px-2">{item.name}</td>
                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                        <td className="py-2 px-2 text-right">
                            <button
                            onClick={handleDelete()}
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
            </div> */}
            <div className="mt-4 flex justify-end items-end gap-3">
                <p className="block text-sm mb-1 ">Code manager :</p>
              <input
                type="text"
                className="border p-2 rounded w-32"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <p className="block text-sm mb-1">Quantité :</p>
              <input
                type="text"
                className="border p-2 rounded w-32"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <button
                onClick={() => setPopupSuppArticle(false)}
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
                <button onClick={() => setPopupAttentTicket(false)} className="px-4 py-2 bg-gray-300 rounded"> oui </button>
                <button onClick={() => setPopupAttentTicket(false)} className="px-4 py-2 bg-blue-500 text-white rounded" > non </button>
              </div>
            </div>
          </div>
        )}

        {PopupReprendreTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4"> Reprendre un ticket </h2>
              <p className="mb-6">Ceci est le contenu de la popup.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setPopupReprendreTicket(false)} className="px-4 py-2 bg-gray-300 rounded"> Annuler </button>
                <button onClick={() => setPopupReprendreTicket(false)} className="px-4 py-2 bg-blue-500 text-white rounded" > Valider </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
