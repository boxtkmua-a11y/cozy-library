import { searchBooks } from "../services/bookApi";
import BookCard from "./BookCard";
import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onBookClick }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    console.log("Кнопка работает!");
    console.log("Запрос:", query);
    console.log("onBookClick в SearchBar:", onBookClick);

    const results = await searchBooks(query);

    console.log("Книги:", results);

    setBooks(results);
  }

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Найти книгу..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button onClick={handleSearch}>Найти</button>
      </div>

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
