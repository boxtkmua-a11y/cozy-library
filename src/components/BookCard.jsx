import { useEffect, useState } from "react";

import "./BookCard.css";

function BookCard({ book, isLibrary = false, onBookClick }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    const alreadySaved = savedBooks.some(
      (savedBook) => savedBook.key === book.key
    );

    setIsSaved(alreadySaved);
  }, [book.key]);

  function handleAddToLibrary(event) {
    event.stopPropagation();

    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    const alreadySaved = savedBooks.some(
      (savedBook) => savedBook.key === book.key
    );

    if (alreadySaved) {
      alert("Эта книга уже есть в библиотеке!");
      return;
    }

    const updatedBooks = [...savedBooks, book];

    localStorage.setItem("cozy-library", JSON.stringify(updatedBooks));

    setIsSaved(true);

    alert("Книга добавлена в вашу библиотеку!");
  }

  function handleRemoveFromLibrary(event) {
    event.stopPropagation();

    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    const updatedBooks = savedBooks.filter(
      (savedBook) => savedBook.key !== book.key
    );

    localStorage.setItem("cozy-library", JSON.stringify(updatedBooks));

    window.location.reload();
  }

  return (
    <article
      className="book-card"
      onClick={() => {
        console.log("Клик по книге:", book.title);
        onBookClick?.(book);
      }}
    >
      {book.cover_i && (
        <img
          className="book-cover"
          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
          alt={`Обложка книги ${book.title}`}
        />
      )}

      <h3>{book.title}</h3>

      <p>{book.author_name?.join(", ")}</p>

      <p>{book.first_publish_year}</p>

      <p>{book.publisher?.[0]}</p>

      {isLibrary ? (
        <button className="remove-button" onClick={handleRemoveFromLibrary}>
          Удалить из библиотеки
        </button>
      ) : (
        <button className="add-button" onClick={handleAddToLibrary}>
          {isSaved ? "✓ Уже в библиотеке" : "Добавить в библиотеку"}
        </button>
      )}
    </article>
  );
}

export default BookCard;
