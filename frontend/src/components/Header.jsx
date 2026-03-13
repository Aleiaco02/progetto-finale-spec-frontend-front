import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
    const { favorites } = useFavorites();

    return (
        <header className="site-header">
            <Link to="/" className="logo">
                Smartphone Comparator
            </Link>

            <nav>
                <Link to="/favorites" className="favorites-button">
                    Preferiti ({favorites.length})
                </Link>
            </nav>
        </header>
    );
}

export default Header;