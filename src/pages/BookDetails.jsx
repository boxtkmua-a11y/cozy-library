import { useEffect, useState } from "react";
import "./BookDetails.css";
import { getBookDetails } from "../services/bookApi";

function BookDetails({ book, onReadClick }) {
  const [details, setDetails] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!book?.key) return;

    async function loadDetails() {
      const details = await getBookDetails(
        book.key,
        book.title,
        book.author_name?.[0]
      );
      setDetails(details);
    }
    loadDetails();
  }, [book]);
  useEffect(() => {
    if (!book?.key) return;

    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    const alreadySaved = savedBooks.some(
      (savedBook) => savedBook.key === book.key
    );

    setIsSaved(alreadySaved);
  }, [book]);

  function handleSaveBook() {
    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    const alreadySaved = savedBooks.some(
      (savedBook) => savedBook.key === book.key
    );

    if (alreadySaved) {
      return;
    }

    const updatedBooks = [...savedBooks, book];

    localStorage.setItem("cozy-library", JSON.stringify(updatedBooks));

    setIsSaved(true);
  }

  if (!book) {
    return (
      <main className="book-details">
        <p>Книга не выбрана.</p>
      </main>
    );
  }

  return (
    <main className="book-details">
      <div className="book-details-content">
        {/* Обложка */}
        <div className="book-details-cover">
          {book.cover_i ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
              alt={`Обложка книги ${book.title}`}
            />
          ) : (
            <span>Обложка отсутствует</span>
          )}
        </div>

        {/* Информация */}
        <div className="book-details-info">
          <p className="book-details-label">ДЕТАЛИ КНИГИ</p>

          <h1>{book.title}</h1>

          <p className="book-details-author">
            {book.author_name?.join(", ") || "Автор неизвестен"}
          </p>

          <p className="book-details-description">
            {details?.description
              ? typeof details.description === "string"
                ? details.description
                : details.description.value
              : "Описание для этой книги пока недоступно."}
          </p>

          <div className="book-details-meta">
            <div>
              <span>Год</span>
              <strong>{book.first_publish_year || "—"}</strong>
            </div>

            <div>
              <span>Автор</span>
              <strong>{book.author_name?.[0] || "—"}</strong>
            </div>

            <div>
              <span>Язык</span>
              <strong>{book.language?.[0] || "—"}</strong>
            </div>

            <div>
              <span>Страницы</span>
              <strong>{details?.number_of_pages || "—"}</strong>
            </div>

            <div>
              <span>Издательство</span>
              <strong>{details?.publishers?.[0] || "—"}</strong>
            </div>
          </div>

          <div className="book-details-actions">
            <button className="read-button" onClick={onReadClick}>
              Начать читать
            </button>

            <button className="save-button" onClick={handleSaveBook}>
              {isSaved ? "✓ В библиотеке" : "♡ Добавить в библиотеку"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BookDetails;
