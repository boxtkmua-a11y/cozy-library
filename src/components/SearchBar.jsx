import { useState } from "react";
import { searchBooks } from "../services/bookApi";
import BookCard from "./BookCard";
import "./SearchBar.css";

function SearchBar({ onBookClick }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Поиск книг по запросу
  async function handleSearch() {
    if (!query.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await searchBooks(query.trim());
      setBooks(results);
    } catch (err) {
      console.error("Ошибка при поиске книг:", err);
      setError("Не удалось загрузить книги. Попробуй ещё раз.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-bar-container">
      {/* Поле ввода и кнопка поиска */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Найти книгу..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          aria-label="Название книги или автор"
        />

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Поиск..." : "Найти"}
        </button>
      </div>

      {/* Сообщение об ошибке */}
      {error && <p className="search-error">{error}</p>}

      {/* Результаты поиска */}
      <div className="search-results">
        {books.length > 0 && <p>Найдено книг: {books.length}</p>}

        {books.map((book) => (
          <BookCard key={book.key} book={book} onBookClick={onBookClick} />
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
