const API_URL = "https://openlibrary.org/search.json";

const titleMap = {
  "грозовой перевал": "Wuthering Heights",
  "гордость и предубеждение": "Pride and Prejudice",
  "джейн эйр": "Jane Eyre",
};

export async function searchBooks(query) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  try {
    const normalizedQuery = cleanQuery.toLowerCase();

    const searchQuery = titleMap[normalizedQuery] || cleanQuery;

    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(searchQuery)}&limit=20`
    );

    if (!response.ok) {
      throw new Error(`Ошибка Open Library: ${response.status}`);
    }

    const data = await response.json();

    console.log("Open Library найдено:", data.numFound);

    console.log("Получено книг:", data.docs?.length);

    return data.docs || [];
  } catch (error) {
    console.error("Ошибка поиска книг:", error);

    return [];
  }
}

export async function getBookDetails(workKey, title, author) {
  const key = workKey.startsWith("/") ? workKey : `/works/${workKey}`;

  const response = await fetch(`https://openlibrary.org${key}.json`);

  let data = {};

  if (response.ok) {
    data = await response.json();
  }

  /* Если Open Library не дала описание */
  if (!data.description) {
    const googleResponse = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
        title
      )}+inauthor:${encodeURIComponent(author || "")}`
    );

    if (googleResponse.ok) {
      const googleData = await googleResponse.json();

      const googleBook = googleData.items?.[0];

      if (googleBook?.volumeInfo?.description) {
        data.description = googleBook.volumeInfo.description;
      }
    }
  }

  return data;
}
