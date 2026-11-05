import { useState } from "react";
import "./Notes.css";

// Безопасно загружаем данные из localStorage
function getSavedData(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function Notes() {
  // Книги и заметки пользователя
  const [books] = useState(() => getSavedData("cozy-library"));
  const [notes, setNotes] = useState(() => getSavedData("cozy-notes"));

  // Выбранная книга
  const [selectedBook, setSelectedBook] = useState(null);

  // Состояние формы
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [noteType, setNoteType] = useState("thought");
  const [content, setContent] = useState("");
  const [pageNumber, setPageNumber] = useState("");

  // Сохраняем заметки в localStorage
  function saveNotes(updatedNotes) {
    setNotes(updatedNotes);
    localStorage.setItem("cozy-notes", JSON.stringify(updatedNotes));
  }

  // Открываем форму новой заметки
  function openNewNote() {
    setEditingNote(null);
    setNoteType("thought");
    setContent("");
    setPageNumber("");
    setIsFormOpen(true);
  }

  // Открываем форму редактирования
  function openEditNote(note) {
    setEditingNote(note);
    setNoteType(note.type);
    setContent(note.content);
    setPageNumber(note.pageNumber || "");
    setIsFormOpen(true);
  }

  // Сохраняем новую или изменённую заметку
  function handleSaveNote(event) {
    event.preventDefault();

    if (!content.trim()) return;

    const now = new Date().toISOString();

    if (editingNote) {
      const updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? {
              ...note,
              type: noteType,
              content: content.trim(),
              pageNumber: pageNumber.trim(),
              updatedAt: now,
            }
          : note
      );

      saveNotes(updatedNotes);
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        bookKey: selectedBook.key,
        type: noteType,
        content: content.trim(),
        pageNumber: pageNumber.trim(),
        createdAt: now,
      };

      saveNotes([newNote, ...notes]);
    }

    setIsFormOpen(false);
    setEditingNote(null);
    setContent("");
    setPageNumber("");
  }

  // Удаляем заметку
  function handleDeleteNote(noteId) {
    const confirmed = window.confirm(
      "Ты действительно хочешь удалить эту заметку?"
    );

    if (!confirmed) return;

    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
  }

  // Возвращаемся к списку книг
  function handleBack() {
    setSelectedBook(null);
    setIsFormOpen(false);
    setEditingNote(null);
  }

  // Заметки только для выбранной книги
  const bookNotes = selectedBook
    ? notes.filter((note) => note.bookKey === selectedBook.key)
    : [];

  // Форматируем дату
  function formatDate(date) {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <main className="notes-page">
      {/* Декоративная иллюстрация с чернильницей и пером */}
      <div className="notes-illustration">
        <img src="/images/notes-illustration.png" alt="" aria-hidden="true" />
      </div>
      {!selectedBook ? (
        <>
          {/* Заголовок страницы */}
          <header className="notes-header">
            <div>
              <span className="notes-eyebrow">YOUR READING JOURNAL</span>

              <h1>Мои заметки</h1>

              <p>Мысли, цитаты и истории, которые хочется сохранить.</p>
            </div>

            <div className="notes-stat">
              <span>{notes.length}</span>
              <small>Сохранённых заметок</small>
            </div>
          </header>

          {/* Коллекция книг */}
          <section className="notes-collection">
            <div className="notes-section-heading">
              <div>
                <h2>Моя коллекция</h2>
                <p>Выбери книгу, чтобы открыть свои заметки</p>
              </div>
            </div>

            {books.length === 0 ? (
              <div className="notes-empty">
                <span>✧</span>
                <h3>Твоя книжная коллекция пока пуста</h3>
                <p>Добавь книги в библиотеку, чтобы создавать к ним заметки.</p>
              </div>
            ) : (
              <div className="notes-bookshelf">
                {books.map((book) => {
                  const bookNoteCount = notes.filter(
                    (note) => note.bookKey === book.key
                  ).length;

                  return (
                    <button
                      className="notes-book"
                      key={book.key}
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="notes-book-cover">
                        {book.cover_i ? (
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                            alt={`Обложка книги ${book.title}`}
                          />
                        ) : (
                          <div className="notes-book-no-cover">
                            {book.title}
                          </div>
                        )}
                      </div>

                      <h3>{book.title}</h3>

                      <p>
                        {book.author_name?.join(", ") || "Автор неизвестен"}
                      </p>

                      <span className="notes-book-count">
                        {bookNoteCount} заметок
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Заметки выбранной книги */}
          <header className="notes-book-header">
            <button className="notes-back-button" onClick={handleBack}>
              ← Назад к коллекции
            </button>

            <div className="notes-book-info">
              <div className="notes-detail-cover">
                {selectedBook.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-M.jpg`}
                    alt={`Обложка книги ${selectedBook.title}`}
                  />
                ) : (
                  <div className="notes-book-no-cover">
                    {selectedBook.title}
                  </div>
                )}
              </div>

              <div>
                <span className="notes-eyebrow">MY READING NOTES</span>

                <h1>{selectedBook.title}</h1>

                <p>
                  {selectedBook.author_name?.join(", ") || "Автор неизвестен"}
                </p>

                <span className="notes-detail-count">
                  {bookNotes.length} заметок
                </span>
              </div>
            </div>

            <button className="notes-add-button" onClick={openNewNote}>
              + Добавить заметку
            </button>
          </header>

          {/* Форма создания и редактирования */}
          {isFormOpen && (
            <form className="notes-form" onSubmit={handleSaveNote}>
              <h2>{editingNote ? "Редактировать заметку" : "Новая заметка"}</h2>

              <label htmlFor="note-type">Тип заметки</label>

              <select
                id="note-type"
                value={noteType}
                onChange={(event) => setNoteType(event.target.value)}
              >
                <option value="thought">Моя мысль</option>
                <option value="quote">Любимая цитата</option>
                <option value="idea">Идея</option>
              </select>

              <label htmlFor="note-content">Текст заметки</label>

              <textarea
                id="note-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Запиши сюда свои мысли, впечатления или цитату..."
                rows={5}
                required
              />

              <label htmlFor="note-page">Номер страницы (необязательно)</label>

              <input
                id="note-page"
                type="number"
                min="1"
                value={pageNumber}
                onChange={(event) => setPageNumber(event.target.value)}
                placeholder="Например, 125"
              />

              <div className="notes-form-actions">
                <button type="submit" className="notes-save-button">
                  Сохранить
                </button>

                <button
                  type="button"
                  className="notes-cancel-button"
                  onClick={() => setIsFormOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Список заметок */}
          <section className="notes-list">
            {bookNotes.length === 0 ? (
              <div className="notes-empty">
                <span>✧</span>
                <h3>Здесь пока нет заметок</h3>
                <p>Сохрани первую мысль или цитату из этой книги.</p>
              </div>
            ) : (
              <div className="notes-cards">
                {bookNotes.map((note) => (
                  <article className="notes-card" key={note.id}>
                    <div className="notes-card-top">
                      <span className={`notes-type ${note.type}`}>
                        {note.type === "quote"
                          ? "Цитата"
                          : note.type === "idea"
                          ? "Идея"
                          : "Моя мысль"}
                      </span>

                      <span className="notes-date">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>

                    <p className="notes-card-content">{note.content}</p>

                    <div className="notes-card-bottom">
                      <span>
                        {note.pageNumber
                          ? `Страница ${note.pageNumber}`
                          : "Без номера страницы"}
                      </span>

                      <div>
                        <button onClick={() => openEditNote(note)}>
                          Изменить
                        </button>

                        <button onClick={() => handleDeleteNote(note.id)}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Notes;
