import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";

function DetailPage() {
    const { id } = useParams();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProduct() {
            try {
                setError("");

                const data = await getProduct(id);
                setProduct(data.product);
            } catch {
                setError("Errore nel caricamento prodotto");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return <h1>Caricamento...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    if (!product) {
        return <h1>Prodotto non trovato</h1>;
    }

    return (
        <main className="detail-page">
            <div className="detail-layout">
                <section className="detail-image-section">
                    <div className="detail-image-card">
                        <img src={product.image} alt={product.title} className="detail-image" />
                    </div>
                </section>

                <section className="detail-info-section">
                    <div className="detail-header">
                        <h1>{product.title}</h1>

                        <button
                            className={`favorite-toggle-btn ${isFavorite(product.id) ? "active" : ""}`}
                            onClick={() => toggleFavorite(product)}
                        >
                            {isFavorite(product.id) ? "Salvato" : "Salva"}
                        </button>
                    </div>

                    <p className="detail-subtitle">
                        Smartphone premium con design elegante e specifiche avanzate.
                    </p>

                    <div className="detail-specs">
                        <div className="detail-spec-row">
                            <span className="detail-label">Brand</span>
                            <span className="detail-value">{product.brand}</span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">Categoria</span>
                            <span className="detail-value">
                                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">Prezzo</span>
                            <span className="detail-value">{product.price} $</span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">Memoria</span>
                            <span className="detail-value">{product.storage} GB</span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">RAM</span>
                            <span className="detail-value">{product.ram} GB</span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">Batteria</span>
                            <span className="detail-value">{product.battery} mAh</span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">Schermo</span>
                            <span className="detail-value">{product.screenSize}"</span>
                        </div>

                        <div className="detail-spec-row">
                            <span className="detail-label">Camera</span>
                            <span className="detail-value">{product.camera}</span>
                        </div>
                    </div>

                    <div className="detail-description">
                        <h2>Descrizione</h2>
                        <p>{product.description}</p>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default DetailPage;