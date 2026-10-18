import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import BookDetails from "./pages/BookDetails";
import Reader from "./pages/Reader";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);

  function handleBookClick(book) {
    console.log("APP получил книгу:", book.title);

    setSelectedBook(book);
    setPage("book-details");
  }

  function handleReadClick() {
    setPage("reader");
  }

  function handleContinueReading(book) {
    if (!book) {
      return;
    }

    setSelectedBook(book);
    setPage("reader");
  }

  return (
    <div>
      <Header
        onLibraryClick={() => {
          setPage("library");
        }}
      />

      <Sidebar
        page={page}
        onHomeClick={() => {
          setPage("home");
        }}
        onSearchClick={() => {
          setPage("search");
        }}
        onLibraryClick={() => {
          setPage("library");
        }}
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
