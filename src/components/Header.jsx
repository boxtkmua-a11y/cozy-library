import "./Header.css";

function Header({ onLibraryClick, onMenuClick, isMenuOpen }) {
  return (
    <header className="header">
      <div className="logo">Cozy Library</div>

      <div className="header-actions">
        <button className="library-button" onClick={onLibraryClick}>
          Моя библиотека
        </button>
      </div>

      {/* Кнопка открывает или закрывает боковое меню */}
      <button
        className="menu-button"
        onClick={onMenuClick}
        aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isMenuOpen}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
    </header>
  );
}

export default Header;
