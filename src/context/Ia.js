import React, { createContext, useContext, useState, useEffect } from 'react';

const IaContext = createContext({
    loading: Boolean,
    saller: Object,
    setSaller: (saller) => { }
});

export function IaProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [saller, setSaller] = useState('')
    const [resultr, setResultr] = useState('')

    useEffect(() => {
      postData()
    }, [saller])
    

    const postData = async () => {
        const url = "https://progpedammi.iut-tlse3.fr/APICelcat/public/sallesmmi?date=2025-01-17"; // Remplace par ton URL
      
        try {
          const response = await fetch(url, {
            method: "POST", // Indique qu'il s'agit d'une requête POST
            headers: {
              "Content-Type": "application/json", // Définit le type de contenu comme JSON
            },
            body: saller, // Convertit les données en JSON pour l'envoyer dans la requête
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const result = await response.json(); // Parse la réponse en JSON
          setResultr(response)
          console.log("Réponse du serveur :", result);
        } catch (error) {
            setResultr(error)
          console.error("Erreur lors de la requête POST :", error);
        }
      };

      


    return (
        <IaContext.Provider value={{
            loading: loading,
            saller: saller, 
            setSaller: setSaller,
            resultr: resultr
        }}>
            {children}
        </IaContext.Provider>
    );
}

export const useIa = () => useContext(IaContext);
