// Ключ, под которым в браузере лежит библиотека
const LIBRARY_KEY = "cozy-library";

// Безопасно читаем JSON из localStorage
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Записываем значение в localStorage в виде JSON
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Возвращаем все книги из библиотеки
export function getLibrary() {
  return readJSON(LIBRARY_KEY, []);
}
// Проверяем, есть ли книга с таким ключом в библиотеке
export function isInLibrary(bookKey) {
  return getLibrary().some((book) => book.key === bookKey);
}

// Добавляем книгу в библиотеку, если её там ещё нет
export function addToLibrary(book) {
  if (isInLibrary(book.key)) return false;

  writeJSON(LIBRARY_KEY, [...getLibrary(), book]);

  return true;
}

// Убираем книгу из библиотеки
export function removeFromLibrary(bookKey) {
  const updatedBooks = getLibrary().filter((book) => book.key !== bookKey);

  writeJSON(LIBRARY_KEY, updatedBooks);
}
// Ключ, под которым лежат заметки
const NOTES_KEY = "cozy-notes";

// Возвращаем все заметки
export function getNotes() {
  return readJSON(NOTES_KEY, []);
}

// Сохраняем весь список заметок
export function storeNotes(notes) {
  writeJSON(NOTES_KEY, notes);
}
