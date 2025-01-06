import React, { createContext, useContext, useState } from 'react';

const IaContext = createContext({
    loading: Boolean,
    text: (text) => { },
    setText: (text) => { },
});

export function IaProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('')


    return (
        <IaContext.Provider value={{
            loading: loading,
            text: text, 
            setText: setText
        }}>
            {children}
        </IaContext.Provider>
    );
}

export const useIa = () => useContext(IaContext);
