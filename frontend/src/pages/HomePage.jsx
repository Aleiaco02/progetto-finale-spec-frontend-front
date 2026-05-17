import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../utils/slug";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";

function HomePage() {

    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceRef = useRef(null);
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("title-asc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { showToast } = useToast();

    useEffect(() => {
        debounceRef.current = setTimeout(() => setDebouncedSearch(searchInput), 400);
        return () => clearTimeout(debounceRef.current);
    }, [searchInput]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setError("");
                const params = {};
                if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
                if (category !== "all") params.category = category;
                const data = await getProducts(params);
                setProducts(data);
            } catch {
                setError("Errore nel caricamento degli smartphone");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [debouncedSearch, category]);

    const sortedProducts = useMemo(() => {
        let result = [...products];

        if (sort === "title-asc")          result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sort === "title-desc")    result.sort((a, b) => b.title.localeCompare(a.title));
        else if (sort === "price-asc")     result.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc")    result.sort((a, b) => b.price - a.price);
        else if (sort === "category-asc")  result.sort((a, b) => a.category.localeCompare(b.category));
        else if (sort === "category-desc") result.sort((a, b) => b.category.localeCompare(a.category));

        return result;
    }, [products, sort]);

    function resetFilters() {
        setSearchInput("");
        setCategory("all");
        setSort("title-asc");
    }

    if (loading) {
        return (
            <main>
                <div className="loading-state">
                    <div className="loading-spinner" />
                    <p>Caricamento smartphone...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return <main><div className="error-state">{error}</div></main>;
    }

    return (
        <main>
            <div className="home-hero">
                <h1>Confronta i migliori <span>smartphone</span>.</h1>
                <p>Filtra per categoria, salva i preferiti e confronta le specifiche fianco a fianco.</p>
            </div>

            <div className="home-compare-banner">
                <div>
                    <h2>Compara i tuoi smartphone preferiti</h2>
                    <p>Scegli due dispositivi e confronta le specifiche tecniche fianco a fianco.</p>
                </div>
                <Link to="/compare">Inizia il confronto →</Link>
            </div>

            <div className="home-layout">
                <aside className="filters-sidebar">
                    <div className="filters-sidebar-header">
                        <h2>Filtri</h2>
                        <button className="filters-reset-btn" onClick={resetFilters}>Reset</button>
                    </div>

                    <div className="filter-group">
                        <label>Cerca</label>
                        <input
                            type="text"
                            placeholder="Cerca smartphone..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Categoria</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="all">Tutte</option>
                            <option value="standard">Standard</option>
                            <option value="plus">Plus</option>
                            <option value="pro">Pro</option>
                            <option value="pro-max">Pro Max</option>
                            <option value="air">Air</option>
                            <option value="ultra">Ultra</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Ordina per</label>
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="title-asc">Titolo A–Z</option>
                            <option value="title-desc">Titolo Z–A</option>
                            <option value="price-asc">Prezzo ↑</option>
                            <option value="price-desc">Prezzo ↓</option>
                            <option value="category-asc">Categoria A–Z</option>
                            <option value="category-desc">Categoria Z–A</option>
                        </select>
                    </div>
                </aside>

                <section className="products-section">
                    <div className="products-section-header">
                        <span className="products-count">
                            {sortedProducts.length === 0 ? "Nessun risultato" : `${sortedProducts.length} smartphone`}
                        </span>
                    </div>

                    {sortedProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">◻</div>
                            <p>Nessuno smartphone trovato per i filtri selezionati.</p>
                            <button className="product-button" onClick={resetFilters} style={{ width: "auto", marginTop: "8px" }}>
                                Rimuovi filtri
                            </button>
                        </div>
                    ) : (
                        <div className="products-container">
                            {sortedProducts.map((product) => (
                                <article
                                    key={product.id}
                                    className="product-card"
                                    onClick={() => navigate(`/products/${toSlug(product.title)}`)}
                                >
                                    <div className="product-card-image">
                                        {product.image && (
                                            <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
                                        )}
                                        <button
                                            className={`card-favorite-btn ${isFavorite(product.id) ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const alreadySaved = isFavorite(product.id);
                                                toggleFavorite(product);
                                                showToast(alreadySaved ? "Rimosso dai preferiti" : "Aggiunto ai preferiti ✓", alreadySaved ? "error" : "success");
                                            }}
                                            title={isFavorite(product.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                                        >
                                            {isFavorite(product.id) ? "★" : "☆"}
                                        </button>
                                    </div>

                                    <div className="product-card-body">
                                        <span className={`product-category-badge badge-${product.category}`}>
                                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                        </span>

                                        <h2>{product.title}</h2>

                                        {product.price && (
                                            <span className="product-card-price">{product.price} $</span>
                                        )}

                                        <button
                                            className="product-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/products/${toSlug(product.title)}`);
                                            }}
                                        >
                                            Scopri →
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default HomePage;
