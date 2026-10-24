import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import "./Library.css";

function Library({ onBookClick }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    setBooks(savedBooks);
  }, []);

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
