import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {

    const { favorites, removeFavorite } = useFavorites();
    const navigate = useNavigate();

    return (
        <main>
            <h1>I tuoi preferiti</h1>

            {favorites.length === 0 ? (
                <p>Non hai ancora aggiunto prodotti ai preferiti.</p>
            ) : (
                <div className="products-grid">

                    {favorites.map((product) => (

                        <article
                            key={product.id}
                            className="product-card favorite-card"
                            onClick={() => navigate(`/products/${product.id}`)}
                        >

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

                            <img src={product.image} alt={product.title} />

                            <h2>{product.title}</h2>

                            <p>
                                Categoria: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </p>

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