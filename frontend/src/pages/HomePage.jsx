import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import { useNavigate } from "react-router-dom";

function HomePage() {

    // stati principali
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("title-asc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // navigazione programmatica verso dettaglio prodotto
    const navigate = useNavigate();

    //primo useEffect
    useEffect(() => {
        async function fetchProducts() {
            try {
                setError("");

                const params = {};

                if (searchInput.trim()) {
                    params.search = searchInput.trim();
                }

                if (category !== "all") {
                    params.category = category;
                }

                const data = await getProducts(params);
                setProducts(data);
            } catch {
                setError("Errore nel caricamento smartphone");
            } finally {
                setLoading(false);
            }
        }

        // primo caricamento immediato
        if (!searchInput.trim()) {
            fetchProducts();
            return;
        }

        // debounce solo quando c'è testo scritto
        const timeoutId = setTimeout(() => {
            console.log("FETCH DOPO DEBOUNCE:", searchInput);
            fetchProducts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput, category]);


    //ordinamento prodotti
    const sortedProducts = useMemo(() => {
        const result = [...products];

        if (sort === "title-asc") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "title-desc") {
            result.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sort === "category-asc") {
            result.sort((a, b) => a.category.localeCompare(b.category));
        } else if (sort === "category-desc") {
            result.sort((a, b) => b.category.localeCompare(a.category));
        }

        return result;
    }, [products, sort]);


    // stato caricamento
    if (loading) {
        return <h1>Caricamento smartphone...</h1>;
    }


    // stato errore
    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <main className="home-page">
            <div className="home-layout">
                <aside className="filters-sidebar">
                    <h2>Filtri</h2>

                    <div className="filter-group">
                        <label>Cerca</label>
                        <input
                            type="text"
                            placeholder="Cerca smartphone..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Categoria</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
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
                        <label>Ordina</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="title-asc">Titolo A-Z</option>
                            <option value="title-desc">Titolo Z-A</option>
                            <option value="category-asc">Categoria A-Z</option>
                            <option value="category-desc">Categoria Z-A</option>
                        </select>
                    </div>
                </aside>

                <section className="products-section">

                    {/* se non ci sono risultati */}
                    {sortedProducts.length === 0 ? (
                        <p>Nessuno smartphone trovato</p>
                    ) : (
                        <div className="products-container">
                            {sortedProducts.map((product) => (
                                <article
                                    key={product.id}
                                    className="product-card"
                                    // click sulla card → vai al dettaglio
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    <h2>{product.title}</h2>

                                    <p>
                                        Categoria:{" "}
                                        {product.category.charAt(0).toUpperCase() +
                                            product.category.slice(1)}
                                    </p>

                                    <button
                                        className="product-button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // evita il click anche sulla card
                                            navigate(`/products/${product.id}`);
                                        }}
                                    >
                                        Vedi prodotto
                                    </button>
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