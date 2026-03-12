import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/products/:id" element={<DetailPage />} />

        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/compare" element={<ComparePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;