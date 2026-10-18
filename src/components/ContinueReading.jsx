import "./ContinueReading.css";

function ContinueReading() {
  return (
    <section className="reading-section">
      <div className="reading-content">
        <div className="reading-cover">
          <div className="reading-cover-placeholder">Обложка</div>
        </div>

        <div className="reading-info">
          <p className="reading-label">ПРОДОЛЖИТЬ ЧТЕНИЕ</p>

          <h2>Тень ветра</h2>

          <p className="reading-author">Карлос Руис Сафон</p>

          <div className="reading-progress-row">
            <div className="reading-progress">
              <div className="reading-progress-value"></div>
            </div>

            <span>72%</span>
          </div>

          <button className="continue-button">
            Продолжить чтение
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="quote-card">
        <div className="quote-mark">“</div>

        <p>
          Книги — это не просто страницы.
          <br />
          Это целые миры, в которые
          <br />
          мы возвращаемся снова и снова.
        </p>

        <div className="quote-decoration">✦</div>
      </div>
    </section>
  );
}

export default ContinueReading;
