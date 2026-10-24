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

  // Храним состояние мобильного меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Загружаем сохранённую тему или используем осеннюю по умолчанию
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cozy-library-theme");
    return THEMES.includes(savedTheme) ? savedTheme : "autumn";
  });

  // Сохраняем выбранную тему
  function handleThemeChange(nextTheme) {
    if (!THEMES.includes(nextTheme)) return;

    setTheme(nextTheme);
    localStorage.setItem("cozy-library-theme", nextTheme);
  }

  // Применяем выбранную тему ко всему документу
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Закрываем меню при нажатии Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Переключаем страницу и закрываем меню
  function navigateTo(nextPage) {
    setPage(nextPage);
    setIsMenuOpen(false);
  }

  // Открываем страницу выбранной книги
  function handleBookClick(book) {
    setSelectedBook(book);
    navigateTo("book-details");
  }

  // Открываем Reader
  function handleReadClick() {
    navigateTo("reader");
  }

  // Продолжаем чтение выбранной книги
  function handleContinueReading(book) {
    if (!book) return;

    setSelectedBook(book);
    navigateTo("reader");
  }

  // Возвращаемся к описанию книги из Reader
  function handleBackFromReader() {
    navigateTo("book-details");
  }

  return (
    <div className="app" data-theme={theme}>
      <Header
        onLibraryClick={() => navigateTo("library")}
        theme={theme}
        onThemeChange={handleThemeChange}
        // Переключаем меню и выводим состояние в консоль
        onMenuClick={() => {
          setIsMenuOpen((open) => {
            return !open;
          });
        }}
        isMenuOpen={isMenuOpen}
      />

      <Sidebar
        page={page}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onHomeClick={() => navigateTo("home")}
        onSearchClick={() => navigateTo("search")}
        onLibraryClick={() => navigateTo("library")}
      />

      {page === "home" && (
        <Home
          onContinueReading={handleContinueReading}
          onBookClick={handleBookClick}
        />
      )}

      {page === "search" && <Search onBookClick={handleBookClick} />}

      {page === "library" && <Library onBookClick={handleBookClick} />}

      {page === "book-details" && (
        <BookDetails book={selectedBook} onReadClick={handleReadClick} />
      )}

      {page === "reader" && (
        <Reader book={selectedBook} onBack={handleBackFromReader} />
      )}
    </div>
  );
}

export default App;
