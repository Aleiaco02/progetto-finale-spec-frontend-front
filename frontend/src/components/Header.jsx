import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import CircularText from './CircularText';

function Header() {
    const { favorites } = useFavorites();

    return (
        <header className="site-header">
            <div className="header-container">

                <Link to="/" className="logo">
                    <CircularText
                        text=" Smart Compare"
                        onHover="speedUp"
                        spinDuration={10}
                        className="custom-class"
                    />
                </Link>


                <nav className="header-actions">
                    <Link to="/compare" className="favorites-button">
                        Compara
                    </Link>

                    <Link to="/favorites" className="favorites-button">
                        Preferiti ({favorites.length})
                    </Link>
                </nav>

            </div>
        </header>
    );
}

export default Header;