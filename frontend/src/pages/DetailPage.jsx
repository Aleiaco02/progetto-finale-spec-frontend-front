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
            <div className="detail-header">
                <h1>{product.title}</h1>

                <button
                    className={`favorite-toggle-btn ${isFavorite(product.id) ? "active" : ""}`}
                    onClick={() => toggleFavorite(product)}
                >
                    {isFavorite(product.id) ? "Salvato" : "Salva"}
                </button>
            </div>

            <img src={product.image} alt={product.title} width="300" />

            <p>Brand: {product.brand}</p>
            <p>Categoria: {product.category}</p>
            <p>Storage: {product.storage} GB</p>
            <p>RAM: {product.ram} GB</p>
            <p>Batteria: {product.battery} mAh</p>
            <p>Schermo: {product.screenSize}"</p>
            <p>Camera: {product.camera}</p>
            <p>{product.description}</p>
        </main>
    );
}

export default DetailPage;