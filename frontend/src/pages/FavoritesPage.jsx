import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../utils/slug";

function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites();
    const { showToast } = useToast();
    const navigate = useNavigate();

    return (
        <main>
            <div className="favorites-header">
                <h1>Preferiti</h1>
                <p>
                    {favorites.length > 0
                        ? `${favorites.length} smartphone ${favorites.length === 1 ? "salvato" : "salvati"}`
                        : "La tua lista è vuota"}
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">♡</div>
                    <p>Non hai ancora salvato nessuno smartphone.<br />Esplora il catalogo e aggiungi i tuoi preferiti.</p>
                    <Link to="/" className="product-button">
                        Esplora il catalogo
                    </Link>
                </div>
            ) : (
                <div className="products-grid">
                    {favorites.map((product) => (
                        <article
                            key={product.id}
                            className="product-card favorite-card"
                            onClick={() => navigate(`/products/${toSlug(product.title)}`)}
                        >
                            <button
                                className="remove-favorite-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFavorite(product.id);
                                    showToast("Rimosso dai preferiti", "error");
                                }}
                                aria-label={`Rimuovi ${product.title} dai preferiti`}
                            >
                                ×
                            </button>

                            <div className="product-card-image">
                                {product.image && (
                                    <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
                                )}
                            </div>

                            <div className="product-card-body">
                                <span className={`product-category-badge badge-${product.category}`}>
                                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                </span>

                                <h2>{product.title}</h2>

                                <button
                                    className="product-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/products/${toSlug(product.title)}`);
                                    }}
                                >
                                    Vai al dettaglio →
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default FavoritesPage;
