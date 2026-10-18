import SearchBar from "../components/SearchBar";
import "./Search.css";

function Search({ onBookClick }) {
  console.log("Search получил onBookClick:", onBookClick);

  return (
    <main className="search-page">
      <div className="search-page-header">
        <p className="search-page-label">COZY LIBRARY</p>

        <h1>Поиск книг</h1>

        <p>Найди книгу, которую захочется добавить в свою библиотеку</p>
      </div>

      <SearchBar onBookClick={onBookClick} />
    </main>
  );
}

export default Search;
