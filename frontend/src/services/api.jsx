const BASE_URL = import.meta.env.VITE_API_URL;

export async function getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${BASE_URL}/products?${query}` : `${BASE_URL}/products`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Errore nel recupero prodotti");
    }

    return response.json();
}

export async function getProduct(id) {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
        throw new Error("Prodotto non trovato");
    }

    return response.json();
}