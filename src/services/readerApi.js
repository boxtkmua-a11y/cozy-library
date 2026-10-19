const GUTENDEX_URL = "/gutendex/books/";
const readerBookCache = new Map();

const titleAliases = {
  "грозовой перевал": "Wuthering Heights",
  "wuthering heights": "Wuthering Heights",
  "бегущий за ветром": "The Kite Runner",
  "the kite runner": "The Kite Runner",
  "война и мир": "War and Peace",
  "war and peace": "War and Peace",
};

function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[()[\]{}:;,.!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTitles(book) {
  const originalTitle = book?.title || "";
  const normalizedTitle = normalize(originalTitle);
  const titles = [];

  if (titleAliases[normalizedTitle]) {
    titles.push(titleAliases[normalizedTitle]);
  }

  if (normalizedTitle.includes("wuthering heights")) {
    titles.push("Wuthering Heights");
  }

  if (normalizedTitle.includes("грозовой перевал")) {
    titles.push("Wuthering Heights");
  }

  if (normalizedTitle.includes("the kite runner")) {
    titles.push("The Kite Runner");
  }

  if (normalizedTitle.includes("бегущий за ветром")) {
    titles.push("The Kite Runner");
  }

  if (normalizedTitle.includes("war and peace")) {
    titles.push("War and Peace");
  }

  if (normalizedTitle.includes("война и мир")) {
    titles.push("War and Peace");
  }

  // Убираем название сборника, если внутри есть известное произведение.
  titles.push(originalTitle);

  return [...new Set(titles.filter(Boolean))];
}

function getPlainTextUrl(formats = {}) {
  const entries = Object.entries(formats);

  // Сначала ищем обычный текст UTF-8.
  const preferred = entries.find(([format, url]) => {
    const key = format.toLowerCase();

    return (
      key.startsWith("text/plain") &&
      key.includes("charset=utf-8") &&
      Boolean(url)
    );
  });

  if (preferred) {
    return preferred[1];
  }

  // Если UTF-8 нет, берём другой доступный текстовый формат.
  const fallback = entries.find(([format, url]) => {
    return format.toLowerCase().startsWith("text/plain") && Boolean(url);
  });

  return fallback?.[1] || null;
}

async function fetchWithTimeout(url, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function findReaderBook(book) {
  if (!book || typeof book !== "object") {
    console.error("Для поиска текста не передан объект книги.");
    return null;
  }
  const cacheKey = book.key || book.title;

  if (readerBookCache.has(cacheKey)) {
    return readerBookCache.get(cacheKey);
  }

  const titles = getTitles(book);

  for (const title of titles) {
    const params = new URLSearchParams({
      search: title,
      mime_type: "text/plain",
    });

    console.log("Поиск текста в Gutenberg:", title);

    try {
      const response = await fetchWithTimeout(
        `${GUTENDEX_URL}?${params.toString()}`
      );

      if (!response.ok) {
        console.warn("Gutenberg вернул статус:", response.status);
        continue;
      }

      const data = await response.json();
      const results = data.results || [];
      console.log(
        "Книги, полученные от Gutendex:",
        results.map((item) => ({
          id: item.id,
          title: item.title,
          formats: item.formats,
        }))
      );

      console.log("Результатов Gutenberg:", results.length);

      const query = normalize(title);

      const candidates = results
        .map((item) => ({
          item,
          textUrl: getPlainTextUrl(item.formats),
          normalizedTitle: normalize(item.title || ""),
        }))
        .filter(({ textUrl }) => Boolean(textUrl));

      const match = candidates.find(({ normalizedTitle }) => {
        return normalizedTitle === query || normalizedTitle.includes(query);
      });

      // Если точного совпадения нет, не выдаём случайную книгу за нужную.
      if (!match) {
        console.log("Подходящая книга не найдена:", title);
        continue;
      }

      console.log("Найден текст:", match.item.title);
      console.log("Ссылка на текст:", match.textUrl);

      const readerBook = {
        id: match.item.id,
        title: match.item.title,
        author: match.item.authors?.[0]?.name || "",
        source: "gutenberg",
        formats: match.item.formats,
        textUrl: match.textUrl,
      };

      readerBookCache.set(cacheKey, readerBook);

      return readerBook;
    } catch (error) {
      console.warn("Запрос Gutenberg не удался:", title, error.message);
    }
  }

  console.log("Полный текст не найден в Gutenberg:", book.title);

  readerBookCache.set(cacheKey, null);

  return null;
}
