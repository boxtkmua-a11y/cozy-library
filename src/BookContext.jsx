import { createContext, useContext } from "react";

const BookContext = createContext();

export function BookProvider({ children, onBookClick }) {
  return (
    <BookContext.Provider value={onBookClick}>{children}</BookContext.Provider>
  );
}

export function useBookClick() {
  return useContext(BookContext);
}
