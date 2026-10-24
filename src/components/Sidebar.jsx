import "./Sidebar.css";

function Sidebar({
  page,
  isMenuOpen,
  onClose,
  onHomeClick,
  onSearchClick,
  onLibraryClick,
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

      {/* Боковая панель с состоянием открытия */}
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
          >
            <span className="sidebar-icon">⌂</span>
            <span>Главная</span>
          </button>

          <button
            className={`sidebar-item ${page === "search" ? "active" : ""}`}
            onClick={onSearchClick}
          >
            <span className="sidebar-icon">⌕</span>
            <span>Поиск</span>
          </button>

          <button
            className={`sidebar-item ${page === "library" ? "active" : ""}`}
            onClick={onLibraryClick}
          >
            <span className="sidebar-icon">▣</span>
            <span>Моя библиотека</span>
          </button>

          {/* Эти разделы пока не подключены к страницам */}
          <button className="sidebar-item" disabled>
            <span className="sidebar-icon">♡</span>
            <span>Избранное</span>
          </button>

          <button className="sidebar-item" disabled>
            <span className="sidebar-icon">✎</span>
            <span>Заметки</span>
          </button>

          <button className="sidebar-item" disabled>
            <span className="sidebar-icon">♫</span>
            <span>Аудиокниги</span>
          </button>
        </nav>

        {/* Настройки подключим после создания страницы */}
        <button className="sidebar-item sidebar-settings" disabled>
          <span className="sidebar-icon">⚙</span>
          <span>Настройки</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
