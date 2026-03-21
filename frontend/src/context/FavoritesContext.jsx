import { createContext, useContext, useEffect, useMemo, useState } from "react";

// creazione del context
const FavoritesContext = createContext();

// funzione per inizializzare i preferiti dal localStorage
function getInitialFavorites() {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
}

// provider
export function FavoritesProvider({ children }) {

    // stato dei preferiti
    const [favorites, setFavorites] = useState(getInitialFavorites);

    // sincronizzazione con localStorage
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // aggiunge un prodotto ai preferiti (senza duplicati)
    function addFavorite(product) {
        setFavorites((prev) => {
            const alreadyExists = prev.some((item) => item.id === product.id);

            if (alreadyExists) {
                return prev;
            }

            return [...prev, product];
        });
    }

    // rimuove un prodotto dai preferiti
    function removeFavorite(productId) {
        setFavorites((prev) =>
            prev.filter((item) => item.id !== productId)
        );
    }

    // aggiunge o rimuove automaticamente
    function toggleFavorite(product) {
        const alreadyExists = favorites.some(
            (item) => item.id === product.id
        );

        if (alreadyExists) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    }

    // controlla se un prodotto è nei preferiti
    function isFavorite(productId) {
        return favorites.some((item) => item.id === productId);
    }

    // valore del context
    const value = useMemo(() => {
        return {
            favorites,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            isFavorite,
        };
    }, [favorites]);

    // provider
    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

// hook personalizzato
export function useFavorites() {
    return useContext(FavoritesContext);
}