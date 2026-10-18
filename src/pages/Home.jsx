import "./Home.css";
import ContinueReading from "../components/ContinueReading";
import SearchBar from "../components/SearchBar";

function Home({ onContinueReading, onBookClick }) {
  return (
    <main className="home">
      {/* Фоновая сцена */}
      <div className="home-background"></div>

      <div className="home-content">
        {/* Приветствие */}
        <section className="welcome-section">
          <div className="welcome-orbit"></div>

          <h1 className="welcome-title">Добро пожаловать, Татьяна!</h1>

          <p className="welcome-text">
            «Хорошая книга — это как новое путешествие,
            <br />в которое можно отправиться, не выходя из дома.»
          </p>

          <div className="welcome-search">
            <SearchBar onBookClick={onBookClick} />
          </div>
        </section>

        {/* Продолжить чтение */}
        <ContinueReading onContinueReading={onContinueReading} />

        {/* Рекомендуем для вас */}
        <section className="recommendations">
          <div className="section-heading">
            <h2>Рекомендуем для вас</h2>

            <button className="section-arrow">→</button>
          </div>

          <div className="recommendation-books">
            <article className="recommendation-card">
              <div className="recommendation-cover">Обложка</div>

              <h3>The Seven Husbands of Evelyn Hugo</h3>

              <p>Taylor Jenkins Reid</p>
            </article>

            <article className="recommendation-card">
              <div className="recommendation-cover">Обложка</div>

              <h3>It Ends With Us</h3>

              <p>Colleen Hoover</p>
            </article>

            <article className="recommendation-card">
              <div className="recommendation-cover">Обложка</div>

              <h3>Daisy Jones & The Six</h3>

              <p>Taylor Jenkins Reid</p>
            </article>

            <article className="recommendation-card">
              <div className="recommendation-cover">Обложка</div>

              <h3>A Little Life</h3>

              <p>Hanya Yanagihara</p>
            </article>

            <article className="recommendation-card">
              <div className="recommendation-cover">Обложка</div>

              <h3>The Silent Patient</h3>

              <p>Alex Michaelides</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
