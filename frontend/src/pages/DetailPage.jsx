import { useEffect, useMemo, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getProducts } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";
import { toSlug } from "../utils/slug";


const CompareCard = memo(function CompareCard({ product }) {
    if (!product) return null;

    const specs = [
        { label: "Brand",    value: product.brand },
        { label: "Categoria", value: product.category },
        { label: "Prezzo",   value: `${product.price} $` },
        { label: "Storage",  value: `${product.storage} GB` },
        { label: "RAM",      value: `${product.ram} GB` },
        { label: "Batteria", value: `${product.battery} mAh` },
        { label: "Schermo",  value: `${product.screenSize}"` },
        { label: "Camera",   value: product.camera },
    ];

    return (
        <div className="compare-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <div className="compare-card-specs">
                {specs.map(({ label, value }) => (
                    <div className="compare-spec-row" key={label}>
                        <strong>{label}</strong>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
            {product.description && (
                <p className="compare-card-description">{product.description}</p>
            )}
        </div>
    );
});


function DetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { showToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [allProducts, setAllProducts] = useState([]);
    const [selectedCompareId, setSelectedCompareId] = useState("");
    const [selectedCompareProduct, setSelectedCompareProduct] = useState(null);
    const [isCompareSelectorOpen, setIsCompareSelectorOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [compareError, setCompareError] = useState("");

    // ESC per chiudere la modale
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") setIsCompareModalOpen(false);
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // condivisione link
    function handleShare() {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copiato negli appunti!", "info");
    }

    // carica la lista prodotti, trova l'id dal slug, poi carica il prodotto completo
    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            setError("");
            try {
                const all = await getProducts();
                setAllProducts(all);

                const match = all.find(p => toSlug(p.title) === slug);
                if (!match) {
                    setError("Prodotto non trovato");
                    return;
                }

                const data = await getProduct(match.id);
                setProduct(data.product);
            } catch {
                setError("Errore nel caricamento prodotto");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    const compareableProducts = useMemo(() =>
        allProducts.filter(p => toSlug(p.title) !== slug),
        [allProducts, slug]
    );

    async function handleSelectCompareProduct(compareId) {
        try {
            setCompareError("");
            setSelectedCompareId(compareId);
            if (!compareId) { setSelectedCompareProduct(null); return; }
            if (String(compareId) === String(product?.id)) {
                setCompareError("Non puoi confrontare lo stesso telefono.");
                setSelectedCompareProduct(null);
                return;
            }
            const data = await getProduct(compareId);
            setSelectedCompareProduct(data.product);
        } catch {
            setCompareError("Errore nel caricamento del prodotto.");
            setSelectedCompareProduct(null);
        }
    }

    function handleRemoveSelectedCompare() {
        setSelectedCompareId("");
        setSelectedCompareProduct(null);
        setCompareError("");
        setIsCompareSelectorOpen(false);
    }

    function handleOpenCompareModal() {
        if (!selectedCompareProduct) {
            setCompareError("Seleziona uno smartphone da confrontare.");
            return;
        }
        setCompareError("");
        setIsCompareModalOpen(true);
    }

    if (loading) {
        return (
            <main>
                <div className="loading-state">
                    <div className="loading-spinner" />
                    <p>Caricamento...</p>
                </div>
            </main>
        );
    }

    if (error) return <main><div className="error-state">{error}</div></main>;
    if (!product) return <main><div className="error-state">Prodotto non trovato</div></main>;

    const favorite = isFavorite(product.id);

    return (
        <>
            <main className="detail-page">

                <button className="detail-back" onClick={() => navigate(-1)}>
                    ← Indietro
                </button>

                <div className="detail-layout">

                    <section className="detail-image-section">

                        <div className="detail-image-card">
                            <div className="detail-image-bg">
                                <img src={product.image} alt={product.title} className="detail-image" />
                            </div>
                        </div>

                        <div className="compare-section">
                            <div className="compare-section-inner">
                                <h2>Confronta con</h2>

                                <div className="compare-current-product">
                                    <img src={product.image} alt={product.title} className="compare-mini-image" />
                                    <p>{product.title}</p>
                                </div>

                                {(isCompareSelectorOpen || selectedCompareProduct) && (
                                    <div className="compare-vs-divider">vs</div>
                                )}

                                {!isCompareSelectorOpen && !selectedCompareProduct && (
                                    <button
                                        className="compare-add-btn"
                                        onClick={() => setIsCompareSelectorOpen(true)}
                                        title="Aggiungi smartphone"
                                    >
                                        +
                                    </button>
                                )}

                                {isCompareSelectorOpen && !selectedCompareProduct && (
                                    <div className="compare-selector-box">
                                        <label htmlFor="compare-select">Scegli uno smartphone</label>
                                        <select
                                            id="compare-select"
                                            value={selectedCompareId}
                                            onChange={e => handleSelectCompareProduct(e.target.value)}
                                        >
                                            <option value="">Seleziona un modello</option>
                                            {compareableProducts.map(item => (
                                                <option key={item.id} value={item.id}>{item.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedCompareProduct && (
                                    <div className="compare-selected-product-wrapper">
                                        <div className="compare-selected-product">
                                            <img src={selectedCompareProduct.image} alt={selectedCompareProduct.title} className="compare-mini-image" />
                                            <p>{selectedCompareProduct.title}</p>
                                        </div>
                                        <button className="remove-selected-compare-btn" onClick={handleRemoveSelectedCompare} title="Rimuovi">×</button>
                                    </div>
                                )}

                                {compareError && <p className="compare-error">{compareError}</p>}

                                <button className="compare-open-btn" onClick={handleOpenCompareModal}>
                                    Confronta
                                </button>
                            </div>
                        </div>

                    </section>

                    <section className="detail-info-section">
                        <div className="detail-info-inner">

                            <div className="detail-header">
                                <h1>{product.title}</h1>
                                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                    <button className="detail-share-btn" onClick={handleShare} title="Copia link">
                                        ↗ Condividi
                                    </button>
                                    <button
                                        className={`favorite-toggle-btn ${favorite ? "active" : ""}`}
                                        onClick={() => {
                                            toggleFavorite(product);
                                            showToast(
                                                favorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti ✓",
                                                favorite ? "error" : "success"
                                            );
                                        }}
                                    >
                                        {favorite ? "✓ Salvato" : "Salva"}
                                    </button>
                                </div>
                            </div>

                            <p className="detail-subtitle">
                                Smartphone premium con design elegante e specifiche avanzate.
                            </p>

                            <div className="detail-specs">
                                {[
                                    ["Brand", product.brand],
                                    ["Categoria", product.category],
                                    ["Prezzo", `${product.price} $`],
                                    ["Memoria", `${product.storage} GB`],
                                    ["RAM", `${product.ram} GB`],
                                    ["Batteria", `${product.battery} mAh`],
                                    ["Schermo", `${product.screenSize}"`],
                                    ["Camera", product.camera],
                                ].map(([label, value]) => (
                                    <div className="detail-spec-row" key={label}>
                                        <span>{label}</span>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="detail-description">
                                <h2>Descrizione</h2>
                                <p>{product.description}</p>
                            </div>

                        </div>
                    </section>

                </div>
            </main>

            {isCompareModalOpen && selectedCompareProduct && (
                <div className="modal-overlay" onClick={() => setIsCompareModalOpen(false)}>
                    <div className="compare-modal" onClick={e => e.stopPropagation()}>
                        <div className="compare-modal-header">
                            <h2>Confronto smartphone</h2>
                            <button className="close-modal-btn" onClick={() => setIsCompareModalOpen(false)} aria-label="Chiudi">×</button>
                        </div>
                        <div className="compare-products">
                            <CompareCard product={product} />
                            <CompareCard product={selectedCompareProduct} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DetailPage;
