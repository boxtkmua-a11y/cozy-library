import { useEffect, useState } from "react";

import "./Reader.css";

import { findReaderBook } from "../services/readerApi";

/* Форматирование диалогов */

function formatDialogue(block) {
  if (!block) return block;

  let text = block.trim();

  const startsWithQuote = text.startsWith("“") || text.startsWith('"');

  if (!startsWithQuote) {
    return text;
  }

  text = text.replace(/^(“|")\s*/, "— ");

  text = text.replace(
    /([,.!?])”(?:\s*)(said|replied|asked|answered|cried|exclaimed|observed|remarked|continued|added|returned|called|whispered|murmured|thought)/gi,

    "$1 — $2"
  );

  text = text.replace(
    /”\s+(said|replied|asked|answered|cried|exclaimed|observed|remarked|continued|added|returned|called|whispered|murmured)/gi,

    " — $1"
  );

  text = text.replace(/,\s*“\s*/g, ", — ");

  text = text.replace(/”\s*$/, "");

  text = text.replace(/"\s*$/, "");

  return text;
}

/* Очистка технического текста */

function cleanTechnicalText(text) {
  if (!text) return "";

  let cleanText = text;

  cleanText = cleanText.replace(/\[\s*Illustration\s*:[\s\S]*?\]\s*/gi, "");

  cleanText = cleanText.replace(
    /^\s*\[\s*(?:Illustration|Image|Frontispiece)\s*\]\s*$/gim,

    ""
  );

  cleanText = cleanText.replace(/\[\s*_?Copyright[\s\S]*?\]_?\s*\]?/gi, "");

  cleanText = cleanText.replace(
    /_?Copyright\s+\d{4}\s+by\s+[A-Za-z .'-]+\.?_?/gi,

    ""
  );

  cleanText = cleanText.replace(/^\s*\[\s*(?:\.\.\.|…)\s*\]\s*$/gm, "");

  cleanText = cleanText.replace(/^\s*\[\s*\]\s*$/gm, "");

  cleanText = cleanText.replace(/^\s*\]\s*$/gm, "");

  return cleanText;
}

/* Форматирование текста книги */

function formatReaderText(text) {
  if (!text) return [];

  let cleanText = text

    .replace(/^\uFEFF/, "")

    .replace(/\r\n/g, "\n")

    .replace(/\r/g, "\n");

  const startMarker =
    /\*{3}\s*START OF (?:THE )?PROJECT GUTENBERG EBOOK[^\n]*\n/i;

  const endMarker = /\*{3}\s*END OF (?:THE )?PROJECT GUTENBERG EBOOK[^\n]*/i;

  const startMatch = cleanText.match(startMarker);

  if (startMatch) {
    cleanText = cleanText.slice(startMatch.index + startMatch[0].length);
  }

  cleanText = cleanText.replace(endMarker, "");

  /* Очищаем Gutenberg */

  cleanText = cleanTechnicalText(cleanText);

  /* Убираем разметку курсива */

  cleanText = cleanText.replace(/_([^_\n]+)_/g, "$1");

  cleanText = cleanText.replace(/^_+/gm, "");

  cleanText = cleanText.replace(/_+$/gm, "");

  cleanText = cleanText.replace(/\s+([,.!?;:])/g, "$1");

  cleanText = cleanText.replace(/[ \t]+/g, " ");

  /* Заголовки глав */

  cleanText = cleanText.replace(
    /^\s*(CHAPTER\s+[IVXLCDM0-9]+)\.?\s*$/gim,

    "\n\n###$1###\n\n"
  );

  /* Заголовки частей */

  cleanText = cleanText.replace(
    /^\s*(PART\s+[IVXLCDM0-9]+)\.?\s*$/gim,

    "\n\n###$1###\n\n"
  );

  const blocks = cleanText

    .split(/\n\s*\n+/)

    .map((block) => {
      let cleanedBlock = block

        .replace(/\s*\n\s*/g, " ")

        .replace(/\s+/g, " ")

        .trim();

      cleanedBlock = cleanTechnicalText(cleanedBlock);

      cleanedBlock = cleanedBlock.replace(/^_+/, "").replace(/_+$/, "").trim();

      return cleanedBlock;
    })

    .filter(Boolean);

  return blocks

    .map((block) => {
      if (block.startsWith("###") && block.endsWith("###")) {
        return {
          type: "chapter",

          text: block.replace(/^###/, "").replace(/###$/, "").trim(),
        };
      }

      return {
        type: "paragraph",

        text: formatDialogue(block),
      };
    })

    .filter((block) => block.text);
}

function Reader({ book }) {
  const [showSettings, setShowSettings] = useState(false);

  const [fontSize, setFontSize] = useState(18);

  const [readerTheme, setReaderTheme] = useState("dark");

  const [readingProgress, setReadingProgress] = useState(0);

  const [readerBook, setReaderBook] = useState(null);

  const [readerLoading, setReaderLoading] = useState(true);

  const [loadingStage, setLoadingStage] = useState("search");

  const [readerText, setReaderText] = useState("");

  /* Отслеживаем и сохраняем прогресс */

  useEffect(() => {
    if (!book) return;

    function updateReadingProgress() {
      const scrollTop = window.scrollY;

      const documentHeight = document.documentElement.scrollHeight;

      const windowHeight = window.innerHeight;

      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight <= 0) {
        setReadingProgress(100);

        return;
      }

      const progress = (scrollTop / scrollableHeight) * 100;

      const roundedProgress = Math.round(Math.min(100, Math.max(0, progress)));

      setReadingProgress(roundedProgress);

      /* Сохраняем позицию */

      localStorage.setItem(
        `cozy-reader-progress-${book.key}`,

        String(roundedProgress)
      );
    }

    window.addEventListener("scroll", updateReadingProgress);

    updateReadingProgress();

    return () => {
      window.removeEventListener("scroll", updateReadingProgress);
    };
  }, [book]);

  /* Восстанавливаем последнюю позицию */

  useEffect(() => {
    if (!book || !readerText) return;

    const savedProgress = localStorage.getItem(
      `cozy-reader-progress-${book.key}`
    );

    if (!savedProgress) {
      return;
    }

    const progress = Number(savedProgress);

    if (Number.isNaN(progress) || progress <= 0 || progress >= 100) {
      return;
    }

    setReadingProgress(progress);

    /* Ждём, пока текст полностью появится на странице */

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const documentHeight = document.documentElement.scrollHeight;

        const windowHeight = window.innerHeight;

        const scrollableHeight = documentHeight - windowHeight;

        const targetPosition = (progress / 100) * scrollableHeight;

        window.scrollTo({
          top: targetPosition,

          behavior: "instant",
        });
      });
    });
  }, [book, readerText]);

  /* Загружаем книгу */

  useEffect(() => {
    async function loadReaderBook() {
      if (!book) return;

      const cacheKey = `cozy-reader-text-${book.key}`;

      try {
        setReaderLoading(true);

        setReaderText("");

        setReaderBook(null);

        /* Начинаем с сохранённой позиции */

        window.scrollTo({
          top: 0,

          behavior: "instant",
        });

        /* Проверяем кэш */

        const cachedText = localStorage.getItem(cacheKey);

        if (cachedText) {
          setReaderText(cachedText);

          setReaderLoading(false);

          return;
        }

        setLoadingStage("search");

        const result = await findReaderBook(book);

        setReaderBook(result);

        if (!result) {
          setReaderLoading(false);

          return;
        }

        if (result.textUrl) {
          setLoadingStage("text");

          // Преобразуем адрес Gutenberg в адрес через локальный прокси Vite.
          const sourceUrl = new URL(result.textUrl);

          if (
            sourceUrl.hostname !== "www.gutenberg.org" &&
            sourceUrl.hostname !== "gutenberg.org"
          ) {
            throw new Error(`Неожиданный адрес книги: ${result.textUrl}`);
          }

          const proxyUrl = `/gutenberg${sourceUrl.pathname}${sourceUrl.search}`;

          console.log("[Reader] Исходный URL:", result.textUrl);
          console.log("[Reader] URL прокси:", proxyUrl);

          const response = await fetch(proxyUrl);

          if (!response.ok) {
            throw new Error("Не удалось загрузить текст книги");
          }

          const text = await response.text();

          if (!text.trim()) {
            throw new Error("Получен пустой текст книги");
          }

          setReaderText(text);

          try {
            localStorage.setItem(cacheKey, text);
          } catch (storageError) {
            console.warn("Не удалось сохранить текст:", storageError);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки текста:", error);
      } finally {
        setReaderLoading(false);
      }
    }

    loadReaderBook();
  }, [book]);

  if (!book) {
    return (
      <main className="reader-page">
        <p>Книга не выбрана.</p>
      </main>
    );
  }

  const formattedText = formatReaderText(readerText);

  return (
    <main className={`reader-page ${readerTheme}`}>
      {/* Панель управления */}

      <div className="reader-toolbar">
        <button className="reader-back">← К книге</button>

        <button
          className="reader-settings"
          onClick={() => setShowSettings(!showSettings)}
        >
          Aa
        </button>

        {/* Настройки */}

        {showSettings && (
          <div className="reader-settings-panel">
            <p>Настройки чтения</p>

            <button
              onClick={() => setFontSize((size) => Math.max(16, size - 1))}
            >
              A−
            </button>

            <span className="reader-font-size">{fontSize}px</span>

            <button
              onClick={() => setFontSize((size) => Math.min(24, size + 1))}
            >
              A+
            </button>

            <div className="reader-theme-buttons">
              <button onClick={() => setReaderTheme("dark")}>Тёмная</button>

              <button onClick={() => setReaderTheme("warm")}>Тёплая</button>

              <button onClick={() => setReaderTheme("light")}>Светлая</button>
            </div>
          </div>
        )}
      </div>

      {/* Заголовок книги */}

      <div className="reader-header">
        <p className="reader-label">СЕЙЧАС ЧИТАЕТЕ</p>

        <h1>{book.title}</h1>

        <p className="reader-author">
          {book.author_name?.join(", ") || "Автор неизвестен"}
        </p>
      </div>

      {/* Текст книги */}

      <div className="reader-content">
        {readerLoading && loadingStage === "search" && <p>Находим книгу...</p>}

        {readerLoading && loadingStage === "text" && (
          <p>Загружаем текст книги...</p>
        )}

        {!readerLoading && readerBook && !readerText && (
          <div className="reader-unavailable">
            <p>
              {readerBook.source === "googlebooks"
                ? "Найден вариант просмотра в Google Books."
                : readerBook.source === "openlibrary"
                ? "Найдено издание в Open Library."
                : "Книга найдена, но текст не удалось загрузить."}
            </p>

            {readerBook.readerUrl && (
              <a
                className="reader-source-link"
                href={readerBook.readerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть книгу у источника ↗
              </a>
            )}
          </div>
        )}

        {readerText &&
          formattedText.map((block, index) =>
            block.type === "chapter" ? (
              <h2
                className="reader-chapter"
                key={index}
                style={{
                  fontSize: `${fontSize + 4}px`,
                }}
              >
                {block.text}
              </h2>
            ) : (
              <p
                className="reader-paragraph"
                key={index}
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >
                {block.text}
              </p>
            )
          )}
      </div>

      {/* Индикатор прогресса */}

      <div className="reader-progress">
        <span>Чтение</span>

        <strong>{readingProgress}%</strong>
      </div>
    </main>
  );
}

export default Reader;
