import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import BookDetails from "./pages/BookDetails";
import Reader from "./pages/Reader";
import "./App.css";

const THEMES = ["autumn", "winter", "spring", "summer"];

function App() {
  const [page, setPage] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);

  // Загружаем сохранённую тему или используем осеннюю по умолчанию
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cozy-library-theme");
    return THEMES.includes(savedTheme) ? savedTheme : "autumn";
  });

  // Сохраняем выбранный сезон и обновляем оформление приложения
  function handleThemeChange(nextTheme) {
    if (!THEMES.includes(nextTheme)) return;

    setTheme(nextTheme);
    localStorage.setItem("cozy-library-theme", nextTheme);
  }
  // Применяем выбранную тему ко всему документу
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  console.log("Выбранная тема:", theme);

  function handleBookClick(book) {
    console.log("APP получил книгу:", book.title);
    setSelectedBook(book);
    setPage("book-details");
  }

  function handleReadClick() {
    setPage("reader");
  }

  function handleContinueReading(book) {
    if (!book) return;

    setSelectedBook(book);
    setPage("reader");
  }

  return (
    <div className="app" data-theme={theme}>
      <Header
        onLibraryClick={() => setPage("library")}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      <Sidebar
        page={page}
        onHomeClick={() => setPage("home")}
        onSearchClick={() => setPage("search")}
        onLibraryClick={() => setPage("library")}
      />

      {page === "home" && (
        <Home
          onContinueReading={handleContinueReading}
          onBookClick={handleBookClick}
        />
      )}

      {page === "search" && <Search onBookClick={handleBookClick} />}
      {page === "library" && <Library />}

      {page === "book-details" && (
        <BookDetails book={selectedBook} onReadClick={handleReadClick} />
      )}

      {page === "reader" && <Reader book={selectedBook} />}
    </div>
  );
}

export default App;
