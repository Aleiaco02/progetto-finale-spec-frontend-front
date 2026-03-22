import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {

    // prendo preferiti e funzione per rimuoverli dal context
    const { favorites, removeFavorite } = useFavorites();

    // per navigazione programmatica
    const navigate = useNavigate();

    return (
        <main>
            <h1 className="favorites-title">I tuoi preferiti</h1>

            {/* se non ci sono preferiti */}
            {favorites.length === 0 ? (
                <p>Non hai ancora aggiunto prodotti ai preferiti.</p>
            ) : (
                <div className="products-grid">

                    {/* ciclo su tutti i prodotti preferiti */}
                    {favorites.map((product) => (

                        <article
                            key={product.id}
                            className="product-card favorite-card"
                            onClick={() => navigate(`/products/${product.id}`)}
                        >

                            {/* bottone rimuovi preferito */}
                            <button
                                className="remove-favorite-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFavorite(product.id);
                                }}
                                aria-label={`Rimuovi ${product.title} dai preferiti`}
                            >
                                ×
                            </button>

                            {/* immagine prodotto */}
                            <img src={product.image} alt={product.title} />

                            {/* titolo */}
                            <h2>{product.title}</h2>

                            {/* categoria formattata */}
                            <p>
                                Categoria: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </p>

                            {/* bottone dettaglio */}
                            <button
                                className="product-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/products/${product.id}`);
                                }}
                            >
                                Vai al dettaglio
                            </button>

                        </article>

                    ))}

                </div>
            )}
        </main>
    );
}

export default FavoritesPage;