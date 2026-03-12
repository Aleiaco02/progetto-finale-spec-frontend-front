import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";

function HomePage() {
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("title-asc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const debounceRef = useRef(null);

    // debounce ricerca
    useEffect(() => {
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [searchInput]);

    // fetch prodotti
    useEffect(() => {
        async function fetchProducts() {
            try {
                setError("");

                const params = {};

                if (debouncedSearch.trim()) {
                    params.search = debouncedSearch.trim();
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

        fetchProducts();
    }, [debouncedSearch, category]);

    // ordinamento prodotti
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

    if (loading) {
        return <h1>Caricamento smartphone...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <main>
            <h1>Smartphone Comparator</h1>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Cerca smartphone..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="all">Tutte le categorie</option>
                    <option value="standard">Standard</option>
                    <option value="plus">Plus</option>
                    <option value="pro">Pro</option>
                    <option value="pro-max">Pro Max</option>
                    <option value="air">Air</option>
                    <option value="ultra">Ultra</option>
                </select>

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

            {sortedProducts.length === 0 ? (
                <p>Nessuno smartphone trovato</p>
            ) : (
                <div className="products-grid">
                    {sortedProducts.map((product) => (
                        <article key={product.id} className="product-card">

                            <h2>{product.title}</h2>

                            <p>Categoria: {product.category}</p>

                            <Link to={`/products/${product.id}`}>
                                Vai al dettaglio
                            </Link>

                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default HomePage;