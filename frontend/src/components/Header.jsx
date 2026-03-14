import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
    const { favorites } = useFavorites();

    return (
        <header className="site-header">
            <div className="header-container">

                <Link to="/" className="logo">
                    Smart Compare
                </Link>

                <nav>
                    <Link to="/favorites" className="favorites-button">
                        Preferiti ({favorites.length})
                    </Link>
                </nav>

            </div>
        </header>
    );
}

export default Header;