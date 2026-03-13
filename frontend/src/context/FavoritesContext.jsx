import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    function addFavorite(product) {
        setFavorites((prev) => {
            const alreadyExists = prev.some((item) => item.id === product.id);

            if (alreadyExists) {
                return prev;
            }

            return [...prev, product];
        });
    }

    function removeFavorite(productId) {
        setFavorites((prev) => prev.filter((item) => item.id !== productId));
    }

    function toggleFavorite(product) {
        const alreadyExists = favorites.some((item) => item.id === product.id);

        if (alreadyExists) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    }

    function isFavorite(productId) {
        return favorites.some((item) => item.id === productId);
    }

    const value = useMemo(() => {
        return {
            favorites,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            isFavorite,
        };
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}