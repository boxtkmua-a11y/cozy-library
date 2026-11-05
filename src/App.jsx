import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import BookDetails from "./pages/BookDetails";
import Reader from "./pages/Reader";
import "./App.css";

// Названия новых разделов
const sectionTitles = {
  favorites: "Избранное",
  notes: "Мои заметки",
  audiobooks: "Аудиокниги",
  settings: "Настройки",
};

function App() {
  const [page, setPage] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);

  // Храним состояние мобильного меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Открываем читалку
  function handleReadClick() {
    navigateTo("reader");
  }

  // Продолжаем чтение выбранной книги
  function handleContinueReading(book) {
    if (!book) return;

    setSelectedBook(book);
    navigateTo("reader");
  }

  // Возвращаемся к описанию книги из читалки
  function handleBackFromReader() {
    navigateTo("book-details");
  }

  return (
    <div className="app">
      <Header
        onLibraryClick={() => navigateTo("library")}
        onMenuClick={() => {
          setIsMenuOpen((open) => !open);
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
        onFavoritesClick={() => navigateTo("favorites")}
        onNotesClick={() => navigateTo("notes")}
        onAudiobooksClick={() => navigateTo("audiobooks")}
        onSettingsClick={() => navigateTo("settings")}
      />

      {/* Главная страница */}
      {page === "home" && (
        <Home
          onContinueReading={handleContinueReading}
          onBookClick={handleBookClick}
        />
      )}

      {/* Поиск книг */}
      {page === "search" && <Search onBookClick={handleBookClick} />}

      {/* Моя библиотека */}
      {page === "library" && <Library onBookClick={handleBookClick} />}

      {/* Избранное, заметки, аудиокниги и настройки */}
      {sectionTitles[page] && (
        <main className="section-placeholder">
          <h1>{sectionTitles[page]}</h1>
          <p>Этот раздел мы скоро наполним функциональностью.</p>
        </main>
      )}

      {/* Информация о выбранной книге */}
      {page === "book-details" && (
        <BookDetails book={selectedBook} onReadClick={handleReadClick} />
      )}

      {/* Читалка */}
      {page === "reader" && (
        <Reader book={selectedBook} onBack={handleBackFromReader} />
      )}
    </div>
  );
}

export default App;
