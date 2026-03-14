import { useEffect, useMemo, useState, memo } from "react";
import { useParams } from "react-router-dom";
import { getProduct, getProducts } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";


// componente usato nella modale per mostrare le specifiche complete di un prodotto
const CompareCard = memo(function CompareCard({ product }) {
    if (!product) return null;

    return (
        <div className="compare-card">
            <img src={product.image} alt={product.title} />

            <h3>{product.title}</h3>

            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Categoria:</strong> {product.category}</p>
            <p><strong>Prezzo:</strong> {product.price} $</p>
            <p><strong>Storage:</strong> {product.storage} GB</p>
            <p><strong>RAM:</strong> {product.ram} GB</p>
            <p><strong>Batteria:</strong> {product.battery} mAh</p>
            <p><strong>Schermo:</strong> {product.screenSize}"</p>
            <p><strong>Camera:</strong> {product.camera}</p>
            <p><strong>Descrizione:</strong> {product.description}</p>
        </div>
    );
});


function DetailPage() {

    // id del prodotto preso dalla URL
    const { id } = useParams();

    // funzioni del context per i preferiti
    const { toggleFavorite, isFavorite } = useFavorites();



    // stati principali del prodotto mostrato nella pagina
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // stati usati per la parte di confronto
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCompareId, setSelectedCompareId] = useState("");
    const [selectedCompareProduct, setSelectedCompareProduct] = useState(null);
    const [isCompareSelectorOpen, setIsCompareSelectorOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [compareError, setCompareError] = useState("");



    // caricamento del prodotto principale quando cambia l'id
    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            setError("");

            try {
                const data = await getProduct(id);
                setProduct(data.product);
            } catch {
                setError("Errore nel caricamento prodotto");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);



    // caricamento di tutti i prodotti per la select del confronto
    // qui il backend restituisce solo dati parziali, quindi usiamo questa lista solo per scegliere il prodotto
    useEffect(() => {
        async function fetchAllProducts() {
            try {
                const data = await getProducts();
                setAllProducts(data);
            } catch {
                console.log("Errore nel caricamento prodotti");
            }
        }

        fetchAllProducts();
    }, []);




    // lista dei prodotti selezionabili nel confronto
    // escludiamo il prodotto attuale dalla select
    const compareableProducts = useMemo(() => {
        return allProducts.filter(
            (item) => String(item.id) !== String(product?.id)
        );
    }, [allProducts, product]);



    // selezione del prodotto da confrontare
    // qui facciamo una chiamata singola con l'id perché ci servono tutti i dati completi:
    // immagine, prezzo, ram, batteria, descrizione ecc.
    async function handleSelectCompareProduct(compareId) {
        try {
            setCompareError("");
            setSelectedCompareId(compareId);

            if (!compareId) {
                setSelectedCompareProduct(null);
                return;
            }

            if (String(compareId) === String(product?.id)) {
                setCompareError("Non puoi confrontare lo stesso telefono.");
                setSelectedCompareProduct(null);
                return;
            }

            const data = await getProduct(compareId);
            setSelectedCompareProduct(data.product);
        } catch {
            setCompareError("Errore nel caricamento del prodotto da confrontare.");
            setSelectedCompareProduct(null);
        }
    }



    // reset del prodotto scelto per il confronto
    function handleRemoveSelectedCompare() {
        setSelectedCompareId("");
        setSelectedCompareProduct(null);
        setCompareError("");
    }



    // apertura della modale di confronto
    function handleOpenCompareModal() {
        if (!selectedCompareProduct) {
            setCompareError("Seleziona un telefono da confrontare.");
            return;
        }

        setCompareError("");
        setIsCompareModalOpen(true);
    }



    // gestione loading, error e prodotto non trovato
    if (loading) return <h1>Caricamento...</h1>;
    if (error) return <h1>{error}</h1>;
    if (!product) return <h1>Prodotto non trovato</h1>;



    // controllo se il prodotto corrente è già nei preferiti
    const favorite = isFavorite(product.id);



    // render principale della pagina
    return (
        <>
            <main className="detail-page">
                <div className="detail-layout">

                    {/* sezione immagine prodotto + confronto */}
                    <section className="detail-image-section">

                        <div className="detail-image-card">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="detail-image"
                            />
                        </div>



                        {/* sezione confronto prodotti */}
                        <div className="compare-section">

                            <h2>Compara con</h2>

                            <div className="compare-current-product">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="compare-mini-image"
                                />
                                <p>{product.title}</p>
                            </div>



                            {/* bottone per mostrare la select */}
                            {!isCompareSelectorOpen && (
                                <button
                                    className="compare-add-btn"
                                    onClick={() => setIsCompareSelectorOpen(true)}
                                >
                                    +
                                </button>
                            )}



                            {/* select per scegliere il prodotto da confrontare */}
                            {isCompareSelectorOpen && (
                                <div className="compare-selector-box">
                                    <label htmlFor="compare-select">
                                        Scegli uno smartphone
                                    </label>

                                    <select
                                        id="compare-select"
                                        value={selectedCompareId}
                                        onChange={(e) =>
                                            handleSelectCompareProduct(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Seleziona un modello
                                        </option>

                                        {compareableProducts.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}



                            {/* prodotto selezionato per il confronto */}
                            {selectedCompareProduct && (
                                <div className="compare-selected-product-wrapper">

                                    <div className="compare-selected-product">
                                        <img
                                            src={selectedCompareProduct.image}
                                            alt={selectedCompareProduct.title}
                                            className="compare-mini-image"
                                        />
                                        <p>{selectedCompareProduct.title}</p>
                                    </div>

                                    <button
                                        className="remove-selected-compare-btn"
                                        onClick={handleRemoveSelectedCompare}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}



                            {/* eventuale errore del confronto */}
                            {compareError && (
                                <p className="compare-error">{compareError}</p>
                            )}



                            {/* bottone per aprire la modale */}
                            <button
                                className="compare-open-btn"
                                onClick={handleOpenCompareModal}
                            >
                                Confronta
                            </button>

                        </div>

                    </section>



                    {/* sezione informazioni del prodotto */}
                    <section className="detail-info-section">

                        <div className="detail-header">
                            <h1>{product.title}</h1>

                            <button
                                className={`favorite-toggle-btn ${favorite ? "active" : ""}`}
                                onClick={() => toggleFavorite(product)}
                            >
                                {favorite ? "Salvato" : "Salva"}
                            </button>
                        </div>



                        <p className="detail-subtitle">
                            Smartphone premium con design elegante e specifiche avanzate.
                        </p>



                        {/* specifiche tecniche */}
                        <div className="detail-specs">

                            <div className="detail-spec-row">
                                <span>Brand</span>
                                <span>{product.brand}</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>Categoria</span>
                                <span>{product.category}</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>Prezzo</span>
                                <span>{product.price} $</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>Memoria</span>
                                <span>{product.storage} GB</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>RAM</span>
                                <span>{product.ram} GB</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>Batteria</span>
                                <span>{product.battery} mAh</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>Schermo</span>
                                <span>{product.screenSize}"</span>
                            </div>

                            <div className="detail-spec-row">
                                <span>Camera</span>
                                <span>{product.camera}</span>
                            </div>

                        </div>


                        {/* descrizione prodotto */}
                        <div className="detail-description">
                            <h2>Descrizione</h2>
                            <p>{product.description}</p>
                        </div>

                    </section>

                </div>
            </main>



            {/* modale con confronto tra i due prodotti */}
            {isCompareModalOpen && selectedCompareProduct && (
                <div
                    className="modal-overlay"
                    onClick={() => setIsCompareModalOpen(false)}
                >
                    <div
                        className="compare-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-modal-btn"
                            onClick={() => setIsCompareModalOpen(false)}
                        >
                            ×
                        </button>

                        <h2>Confronto smartphone</h2>

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