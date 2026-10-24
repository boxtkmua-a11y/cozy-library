const GUTENDEX_URL = "/gutendex/books/";
const OPEN_LIBRARY_URL = "https://openlibrary.org/search.json";
const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

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

  titles.push(originalTitle);

  return [...new Set(titles.filter(Boolean))];
}

function getPlainTextUrl(formats = {}) {
  const entries = Object.entries(formats);

  const preferred = entries.find(([format, url]) => {
    const key = format.toLowerCase();

    return (
      key.startsWith("text/plain") &&
      key.includes("charset=utf-8") &&
      Boolean(url)
    );
  });

  if (preferred) return preferred[1];

  const fallback = entries.find(([format, url]) => {
    return format.toLowerCase().startsWith("text/plain") && Boolean(url);
  });

  return fallback?.[1] || null;
}

// Выполняем запрос с увеличенным тайм-аутом и понятной ошибкой
async function fetchWithTimeout(url, timeout = 30000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Превышено время ожидания ответа: ${url}`);
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function getAuthorName(book) {
  if (Array.isArray(book?.author_name)) {
    return book.author_name.join(", ");
  }

  return book?.authors?.[0]?.name || "";
}

function isTitleMatch(foundTitle, requestedTitle) {
  const found = normalize(foundTitle);
  const requested = normalize(requestedTitle);

  return found === requested || found.startsWith(`${requested} `);
}

/* 1. Ищем полный текст в Gutenberg */

async function findInGutenberg(title) {
  const params = new URLSearchParams({
    search: title,
    mime_type: "text/plain",
  });

  const response = await fetchWithTimeout(
    `${GUTENDEX_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Gutendex вернул статус ${response.status}`);
  }

  const data = await response.json();
  const results = data.results || [];

  const candidates = results
    .map((item) => ({
      item,
      textUrl: getPlainTextUrl(item.formats),
    }))
    .filter(({ textUrl }) => Boolean(textUrl));

  const match = candidates.find(({ item }) => isTitleMatch(item.title, title));

  if (!match) return null;

  return {
    id: match.item.id,
    title: match.item.title,
    author: match.item.authors?.[0]?.name || "",
    source: "gutenberg",
    formats: match.item.formats,
    textUrl: match.textUrl,
    readerUrl: `https://www.gutenberg.org/ebooks/${match.item.id}`,
    isExternalOnly: false,
  };
}

/* 2. Ищем издание в Open Library */

async function findInOpenLibrary(title) {
  const params = new URLSearchParams({
    title,
    fields: "title,author_name,key,has_fulltext,ia",
    limit: "10",
  });

  const response = await fetchWithTimeout(
    `${OPEN_LIBRARY_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Open Library вернула статус ${response.status}`);
  }

  const data = await response.json();
  const docs = data.docs || [];

  const match = docs.find((item) => isTitleMatch(item.title, title));

  if (!match) return null;

  const archiveId = match.ia?.[0] || null;

  return {
    id: match.key,
    title: match.title,
    author: getAuthorName(match),
    source: "openlibrary",
    formats: {},
    textUrl: null,
    readerUrl: archiveId
      ? `https://archive.org/details/${encodeURIComponent(archiveId)}`
      : `https://openlibrary.org${match.key}`,
    isExternalOnly: true,
  };
}

/* 3. Ищем доступный просмотр в Google Books */

async function findInGoogleBooks(title) {
  const params = new URLSearchParams({
    q: `intitle:${title}`,
    maxResults: "10",
    printType: "books",
  });

  const response = await fetchWithTimeout(
    `${GOOGLE_BOOKS_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Google Books вернул статус ${response.status}`);
  }

  const data = await response.json();
  const items = data.items || [];

  const match = items.find((item) =>
    isTitleMatch(item.volumeInfo?.title, title)
  );

  if (!match) return null;

  const info = match.volumeInfo || {};
  const access = match.accessInfo || {};

  const readerUrl =
    access.webReaderLink ||
    info.previewLink ||
    info.infoLink ||
    `https://books.google.com/books?q=${encodeURIComponent(title)}`;

  return {
    id: match.id,
    title: info.title || title,
    author: info.authors?.join(", ") || "",
    source: "googlebooks",
    formats: {},
    textUrl: null,
    readerUrl,
    isExternalOnly: true,
    viewability: access.viewability || "UNKNOWN",
  };
}

/* Основной поиск по источникам */

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

  // Сначала пробуем найти полный текст.
  for (const title of titles) {
    try {
      console.log("Поиск полного текста в Gutenberg:", title);

      const result = await findInGutenberg(title);

      if (result) {
        console.log("Найден полный текст:", result.title);
        readerBookCache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn("Ошибка поиска в Gutenberg:", error.message);
    }
  }

  // Если полного текста нет, ищем издание в Open Library.
  for (const title of titles) {
    try {
      console.log("Поиск в Open Library:", title);

      const result = await findInOpenLibrary(title);

      if (result) {
        console.log("Найдено издание:", result.title);
        readerBookCache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn("Ошибка поиска в Open Library:", error.message);
    }
  }

  // Последний вариант — просмотр через Google Books.
  for (const title of titles) {
    try {
      console.log("Поиск в Google Books:", title);

      const result = await findInGoogleBooks(title);

      if (result) {
        console.log("Найден вариант просмотра:", result.title);
        readerBookCache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn("Ошибка поиска в Google Books:", error.message);
    }
  }

  console.log("Книга не найдена в доступных источниках:", book.title);

  readerBookCache.set(cacheKey, null);
  return null;
}
