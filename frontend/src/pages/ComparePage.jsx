import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getProduct } from "../services/api";

const SPECS = [
    { label: "Brand",    key: "brand" },
    { label: "Categoria", key: "category" },
    { label: "Prezzo",   key: "price",      fmt: v => `${v} $` },
    { label: "Storage",  key: "storage",    fmt: v => `${v} GB` },
    { label: "RAM",      key: "ram",        fmt: v => `${v} GB` },
    { label: "Batteria", key: "battery",    fmt: v => `${v} mAh` },
    { label: "Schermo",  key: "screenSize", fmt: v => `${v}"` },
    { label: "Camera",   key: "camera" },
];

function CompareSlot({ label, allProducts, otherId, product, onSelect, onClear }) {
    return (
        <div className="cp-slot">
            <div className="cp-slot-header">
                <span className="cp-slot-label">{label}</span>
                {product && (
                    <button className="cp-slot-clear" onClick={onClear}>×</button>
                )}
            </div>

            <select
                className="cp-slot-select"
                value={product?.id ?? ""}
                onChange={e => onSelect(e.target.value)}
            >
                <option value="">Seleziona uno smartphone</option>
                {allProducts
                    .filter(p => String(p.id) !== String(otherId))
                    .map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))
                }
            </select>

            {product ? (
                <div className="cp-slot-preview">
                    <div className="cp-slot-img">
                        <img src={product.image} alt={product.title} />
                    </div>
                    <div className="cp-slot-name">
                        <span className={`product-category-badge badge-${product.category}`}>
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                        <h3>{product.title}</h3>
                    </div>
                </div>
            ) : (
                <div className="cp-slot-empty">
                    <div className="cp-slot-empty-icon">+</div>
                    <p>Nessun dispositivo selezionato</p>
                </div>
            )}
        </div>
    );
}

function ComparePage() {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [productA, setProductA] = useState(null);
    const [productB, setProductB] = useState(null);

    useEffect(() => {
        async function fetchAll() {
            try {
                const data = await getProducts();
                setAllProducts(data);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    async function handleSelectA(id) {
        if (!id) { setProductA(null); return; }
        const data = await getProduct(id);
        setProductA(data.product);
    }

    async function handleSelectB(id) {
        if (!id) { setProductB(null); return; }
        const data = await getProduct(id);
        setProductB(data.product);
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

    const bothSelected = productA && productB;

    return (
        <main className="compare-page">

            <Link to="/" className="detail-back">← Home</Link>

            <div className="cp-hero">
                <h1>Compara i tuoi <span>smartphone</span> preferiti</h1>
                <p>Seleziona due dispositivi e confronta le specifiche tecniche fianco a fianco.</p>
            </div>

            <div className="cp-selectors">
                <CompareSlot
                    label="Dispositivo A"
                    allProducts={allProducts}
                    otherId={productB?.id}
                    product={productA}
                    onSelect={handleSelectA}
                    onClear={() => setProductA(null)}
                />

                <div className="cp-vs">
                    <span>VS</span>
                </div>

                <CompareSlot
                    label="Dispositivo B"
                    allProducts={allProducts}
                    otherId={productA?.id}
                    product={productB}
                    onSelect={handleSelectB}
                    onClear={() => setProductB(null)}
                />
            </div>

            {bothSelected && (
                <div className="cp-table">
                    <div className="cp-table-header">
                        <div className="cp-table-spec-col" />
                        <div className="cp-table-val-col">
                            <img src={productA.image} alt={productA.title} />
                            <strong>{productA.title}</strong>
                        </div>
                        <div className="cp-table-val-col">
                            <img src={productB.image} alt={productB.title} />
                            <strong>{productB.title}</strong>
                        </div>
                    </div>

                    {SPECS.map(({ label, key, fmt }) => {
                        const valA = fmt ? fmt(productA[key]) : productA[key];
                        const valB = fmt ? fmt(productB[key]) : productB[key];
                        return (
                            <div className="cp-table-row" key={key}>
                                <div className="cp-table-spec-col">{label}</div>
                                <div className="cp-table-val-col">{valA}</div>
                                <div className="cp-table-val-col">{valB}</div>
                            </div>
                        );
                    })}

                    <div className="cp-table-row cp-description-row">
                        <div className="cp-table-spec-col">Descrizione</div>
                        <div className="cp-table-val-col cp-description">{productA.description}</div>
                        <div className="cp-table-val-col cp-description">{productB.description}</div>
                    </div>
                </div>
            )}

            {!bothSelected && (
                <div className="cp-hint">
                    {!productA && !productB
                        ? "Seleziona due smartphone per iniziare il confronto."
                        : "Seleziona il secondo smartphone per vedere il confronto."}
                </div>
            )}

        </main>
    );
}

export default ComparePage;
