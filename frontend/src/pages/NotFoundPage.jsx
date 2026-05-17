import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <main>
            <div className="not-found">
                <div className="not-found-code">404</div>
                <h1>Pagina non trovata</h1>
                <p>La pagina che stai cercando non esiste o è stata spostata.</p>
                <Link to="/" className="detail-back" style={{ marginBottom: 0 }}>
                    ← Torna alla home
                </Link>
            </div>
        </main>
    );
}

export default NotFoundPage;
