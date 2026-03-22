import { useEffect, useState } from "react";
import { getProducts, getProduct } from "../services/api";
import './comparePage.css'

function ComparePage() {
    // stati principali
    const [allProducts, setAllProducts] = useState([]);
    const [firstCompareId, setFirstCompareId] = useState("");
    const [secondCompareId, setSecondCompareId] = useState("");
    const [firstProduct, setFirstProduct] = useState(null);
    const [secondProduct, setSecondProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // carico tutti i prodotti all'avvio
    useEffect(() => {
        async function fetchProducts() {
            try {
                setError("");
                const data = await getProducts();
                setAllProducts(data);
            } catch {
                setError("Errore nel caricamento prodotti");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    // gestisco selezione primo prodotto
    async function handleFirstChange(productId) {
        setFirstCompareId(productId);

        if (!productId) {
            setFirstProduct(null);
            return;
        }

        try {
            const data = await getProduct(productId);
            setFirstProduct(data.product);
        } catch {
            setError("Errore nel caricamento del primo prodotto");
        }
    }

    // gestisco selezione secondo prodotto
    async function handleSecondChange(productId) {
        setSecondCompareId(productId);

        if (!productId) {
            setSecondProduct(null);
            return;
        }

        try {
            const data = await getProduct(productId);
            setSecondProduct(data.product);
        } catch {
            setError("Errore nel caricamento del secondo prodotto");
        }
    }

    // stato loading
    if (loading) {
        return <h1>Caricamento comparatore...</h1>;
    }

    // stato errore
    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <main className="compare-page">
            <h1>Compara smartphone</h1>

            <div className="compare-top-section">
                {/* select primo telefono */}
                <div className="compare-select-box">
                    <label htmlFor="first-phone">Primo smartphone</label>
                    <select
                        id="first-phone"
                        value={firstCompareId}
                        onChange={(e) => handleFirstChange(e.target.value)}
                    >
                        <option value="">Seleziona il primo telefono</option>
                        {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* select secondo telefono */}
                <div className="compare-select-box">
                    <label htmlFor="second-phone">Secondo smartphone</label>
                    <select
                        id="second-phone"
                        value={secondCompareId}
                        onChange={(e) => handleSecondChange(e.target.value)}
                    >
                        <option value="">Seleziona il secondo telefono</option>
                        {allProducts.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                                disabled={String(product.id) === String(firstCompareId)}
                            >
                                {product.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* mostro confronto solo se entrambi selezionati */}
            {firstProduct && secondProduct ? (
                <div className="compare-products-page">

                    {/* card primo prodotto */}
                    <div className="compare-page-card">
                        <img src={firstProduct.image} alt={firstProduct.title} />
                        <h2>{firstProduct.title}</h2>

                        {/* specifiche */}
                        <div className="compare-spec-row">
                            <span>Brand</span>
                            <span>{firstProduct.brand}</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Categoria</span>
                            <span>
                                {firstProduct.category.charAt(0).toUpperCase() +
                                    firstProduct.category.slice(1)}
                            </span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Prezzo</span>
                            <span>{firstProduct.price} $</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Storage</span>
                            <span>{firstProduct.storage} GB</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>RAM</span>
                            <span>{firstProduct.ram} GB</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Batteria</span>
                            <span>{firstProduct.battery} mAh</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Schermo</span>
                            <span>{firstProduct.screenSize}"</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Camera</span>
                            <span>{firstProduct.camera}</span>
                        </div>

                        {/* descrizione */}
                        <div className="compare-description-box">
                            <h3>Descrizione</h3>
                            <p>{firstProduct.description}</p>
                        </div>
                    </div>

                    {/* card secondo prodotto */}
                    <div className="compare-page-card">
                        <img src={secondProduct.image} alt={secondProduct.title} />
                        <h2>{secondProduct.title}</h2>

                        {/* specifiche */}
                        <div className="compare-spec-row">
                            <span>Brand</span>
                            <span>{secondProduct.brand}</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Categoria</span>
                            <span>
                                {secondProduct.category.charAt(0).toUpperCase() +
                                    secondProduct.category.slice(1)}
                            </span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Prezzo</span>
                            <span>{secondProduct.price} $</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Storage</span>
                            <span>{secondProduct.storage} GB</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>RAM</span>
                            <span>{secondProduct.ram} GB</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Batteria</span>
                            <span>{secondProduct.battery} mAh</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Schermo</span>
                            <span>{secondProduct.screenSize}"</span>
                        </div>

                        <div className="compare-spec-row">
                            <span>Camera</span>
                            <span>{secondProduct.camera}</span>
                        </div>

                        <div className="compare-description-box">
                            <h3>Descrizione</h3>
                            <p>{secondProduct.description}</p>
                        </div>
                    </div>
                </div>
            ) : (

                // messaggio se non selezionati entrambi
                <p className="compare-empty-text">
                    Seleziona due smartphone per confrontarli.
                </p>
            )}
        </main>
    );
}

export default ComparePage;