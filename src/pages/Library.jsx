import { useState } from "react";
import { getLibrary } from "../services/storage";
import BookCard from "../components/BookCard";
import "./Library.css";

function Library({ onBookClick }) {
  const [books] = useState(() => getLibrary());

  return (
    <main className="library">
      <h1>Моя библиотека</h1>

      <p className="library-subtitle">
        Твоё пространство для любимых историй, в которое всегда хочется
        возвращаться.
      </p>

      {books.length === 0 ? (
        <p>В библиотеке пока нет книг.</p>
      ) : (
        <div className="library-books">
          {books.map((book) => (
            <BookCard
              key={book.key}
              book={book}
              isLibrary={true}
              onBookClick={onBookClick}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Library;
