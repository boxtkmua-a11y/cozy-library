import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import BookDetails from "./pages/BookDetails";
import Reader from "./pages/Reader";
import Notes from "./pages/Notes";

import "./App.css";

// Названия новых разделов
const sectionTitles = {
  favorites: "Избранное",
  audiobooks: "Аудиокниги",
  settings: "Настройки",
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/" ? "home" : location.pathname.slice(1);
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
    navigate(nextPage === "home" ? "/" : "/" + nextPage);
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
      {/* Верхняя панель */}
      <Header
        onLibraryClick={() => navigateTo("library")}
        onMenuClick={() => {
          setIsMenuOpen((open) => !open);
        }}
        isMenuOpen={isMenuOpen}
      />

      {/* Боковое меню */}
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

      <Routes>
        <Route
          path="/"
          element={
            <Home
              onContinueReading={handleContinueReading}
              onBookClick={handleBookClick}
            />
          }
        />
        <Route
          path="/search"
          element={<Search onBookClick={handleBookClick} />}
        />
        <Route
          path="/library"
          element={<Library onBookClick={handleBookClick} />}
        />
        <Route
          path="/notes"
          element={<Notes onBookClick={handleBookClick} />}
        />
        <Route
          path="/favorites"
          element={
            <main className="section-placeholder">
              <h1>{sectionTitles.favorites}</h1>
              <p>Этот раздел мы скоро наполним функциональностью.</p>
            </main>
          }
        />
        <Route
          path="/book-details"
          element={
            <BookDetails book={selectedBook} onReadClick={handleReadClick} />
          }
        />
        <Route
          path="/reader"
          element={<Reader book={selectedBook} onBack={handleBackFromReader} />}
        />
      </Routes>
    </div>
  );
}

export default App;
