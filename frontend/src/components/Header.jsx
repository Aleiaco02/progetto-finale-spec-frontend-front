import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
    const { favorites } = useFavorites();

    return (
        <header className="site-header">
            <div className="header-container">

                <Link to="/" className="logo">
                    Smart<span>Compare</span>
                </Link>

                <nav style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Link to="/compare" className="favorites-button">
                        Confronta
                    </Link>
                    <Link to="/favorites" className="favorites-button">
                        Preferiti
                        <span className="favorites-badge">{favorites.length}</span>
                    </Link>
                </nav>

            </div>
        </header>
    );
}

export default Header;
