import "./Sidebar.css";

function Sidebar({
  page,
  isMenuOpen,
  onClose,
  onHomeClick,
  onSearchClick,
  onLibraryClick,
  onFavoritesClick,
  onNotesClick,
  onAudiobooksClick,
  onSettingsClick,
}) {
  return (
    <>
      {/* Затемнение за открытым меню */}
      {isMenuOpen && (
        <button
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Закрыть меню"
        />
      )}

      {/* Боковая панель */}
      <aside
        className={`sidebar ${isMenuOpen ? "sidebar-open" : ""}`}
        aria-label="Основная навигация"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✧</div>

          <div>
            <div className="sidebar-brand-title">Cozy</div>
            <div className="sidebar-brand-subtitle">Library</div>
          </div>
        </div>

        {/* Основные разделы приложения */}
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${page === "home" ? "active" : ""}`}
            onClick={onHomeClick}
            aria-current={page === "home" ? "page" : undefined}
          >
            <span className="sidebar-icon">⌂</span>
            <span>Главная</span>
          </button>

          <button
            className={`sidebar-item ${page === "search" ? "active" : ""}`}
            onClick={onSearchClick}
            aria-current={page === "search" ? "page" : undefined}
          >
            <span className="sidebar-icon">⌕</span>
            <span>Поиск</span>
          </button>

          <button
            className={`sidebar-item ${page === "library" ? "active" : ""}`}
            onClick={onLibraryClick}
            aria-current={page === "library" ? "page" : undefined}
          >
            <span className="sidebar-icon">▣</span>
            <span>Моя библиотека</span>
          </button>

          <button
            className={`sidebar-item ${page === "favorites" ? "active" : ""}`}
            onClick={onFavoritesClick}
            aria-current={page === "favorites" ? "page" : undefined}
          >
            <span className="sidebar-icon">♡</span>
            <span>Избранное</span>
          </button>

          <button
            className={`sidebar-item ${page === "notes" ? "active" : ""}`}
            onClick={onNotesClick}
            aria-current={page === "notes" ? "page" : undefined}
          >
            <span className="sidebar-icon">✎</span>
            <span>Заметки</span>
          </button>

          <button
            className={`sidebar-item ${page === "audiobooks" ? "active" : ""}`}
            onClick={onAudiobooksClick}
            aria-current={page === "audiobooks" ? "page" : undefined}
          >
            <span className="sidebar-icon">♫</span>
            <span>Аудиокниги</span>
          </button>
        </nav>

        {/* Настройки приложения */}
        <button
          className={`sidebar-item sidebar-settings ${
            page === "settings" ? "active" : ""
          }`}
          onClick={onSettingsClick}
          aria-current={page === "settings" ? "page" : undefined}
        >
          <span className="sidebar-icon">⚙</span>
          <span>Настройки</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
