import "./Sidebar.css";

function Sidebar({ page, onHomeClick, onSearchClick, onLibraryClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">✧</div>

        <div>
          <div className="sidebar-brand-title">Cozy</div>
          <div className="sidebar-brand-subtitle">Library</div>
        </div>
      </div>

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

        <button className="sidebar-item">
          <span className="sidebar-icon">♡</span>
          <span>Избранное</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-icon">✎</span>
          <span>Заметки</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-icon">♫</span>
          <span>Аудиокниги</span>
        </button>
      </nav>

      <button className="sidebar-item sidebar-settings">
        <span className="sidebar-icon">⚙</span>
        <span>Настройки</span>
      </button>
    </aside>
  );
}

export default Sidebar;
