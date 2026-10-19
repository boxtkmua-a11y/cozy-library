import { useEffect, useState } from "react";
import "./BookDetails.css";
import { getBookDetails } from "../services/bookApi";
import { findReaderBook } from "../services/readerApi";

function BookDetails({ book, onReadClick }) {
  const [details, setDetails] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [availability, setAvailability] = useState("checking");

  useEffect(() => {
    if (!book?.key) return;

    let cancelled = false;

    async function loadDetails() {
      const result = await getBookDetails(
        book.key,
        book.title,
        book.author_name?.[0]
      );

      if (!cancelled) {
        setDetails(result);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [book]);

  useEffect(() => {
    if (!book) return;

    let cancelled = false;

    async function checkAvailability() {
      setAvailability("checking");

      try {
        const result = await findReaderBook(book);

        if (!cancelled) {
          setAvailability(result ? "available" : "unavailable");
        }
      } catch (error) {
        console.error("Ошибка проверки доступности текста:", error);

        if (!cancelled) {
          setAvailability("unavailable");
        }
      }
    }

    checkAvailability();

    return () => {
      cancelled = true;
    };
  }, [book]);

  useEffect(() => {
    if (!book?.key) return;

    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    setIsSaved(savedBooks.some((savedBook) => savedBook.key === book.key));
  }, [book]);

  function handleSaveBook() {
    const savedBooks = JSON.parse(localStorage.getItem("cozy-library") || "[]");

    const alreadySaved = savedBooks.some(
      (savedBook) => savedBook.key === book.key
    );

    if (alreadySaved) return;

    localStorage.setItem("cozy-library", JSON.stringify([...savedBooks, book]));

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
            <button
              className="read-button"
              onClick={onReadClick}
              disabled={availability !== "available"}
            >
              {availability === "checking"
                ? "Проверяем доступность..."
                : availability === "available"
                ? "Начать читать"
                : "Текст недоступен"}
            </button>

            <button className="save-button" onClick={handleSaveBook}>
              {isSaved ? "✓ В библиотеке" : "♡ Добавить в библиотеку"}
            </button>
          </div>

          {availability === "unavailable" && (
            <p role="status">
              Полный текст этой книги не найден в нашем источнике — Gutenberg.
              Добавить книгу в библиотеку по-прежнему можно.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default BookDetails;
