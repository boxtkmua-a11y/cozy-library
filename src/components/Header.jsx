import "./Header.css";

// Доступные сезонные темы
const SEASONS = [
  { id: "autumn", label: "Осень" },
  { id: "winter", label: "Зима" },
  { id: "spring", label: "Весна" },
  { id: "summer", label: "Лето" },
];

function Header({ onLibraryClick, theme, onThemeChange }) {
  // Находим название выбранного сезона для отображения в кнопке
  const currentSeason =
    SEASONS.find((season) => season.id === theme) || SEASONS[0];

  return (
    <header className="header">
      <div className="logo">Cozy Library</div>

      <div className="header-actions">
        <label className="season-selector">
          <span className="season-label">Сезон</span>

          <select
            className="season-select"
            value={theme}
            onChange={(event) => onThemeChange(event.target.value)}
            aria-label="Выбрать сезон оформления"
          >
            {SEASONS.map((season) => (
              <option key={season.id} value={season.id}>
                {season.icon} {season.label}
              </option>
            ))}
          </select>
        </label>

        <button className="library-button" onClick={onLibraryClick}>
          Моя библиотека
        </button>
      </div>

      <button className="menu-button" aria-label="Открыть меню">
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
