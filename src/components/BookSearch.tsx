import React, { useState, useEffect, useRef } from "react";
import { addToFavorites, type Book, getFavorites } from "./Favorites";

interface BookSearchProps {
  userId: string;
}

const BookSearch: React.FC<BookSearchProps> = ({ userId }) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxResults = 10;

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavorites(userId);
      setFavorites(favs || []);
    };
    fetchFavorites();
  }, [userId]);

  const searchBooks = async (pageIndex = 0) => {
    const startIndex = pageIndex * maxResults;

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&startIndex=${startIndex}&maxResults=${maxResults}`
    );

    const data = await res.json();
    setTotalItems(data.totalItems || 0);

    const mappedBooks: Book[] =
      data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      })) || [];

    setBooks(mappedBooks);
    setPage(pageIndex);
  };

  const handleAddToFavorites = async (book: Book) => {
    const alreadyFavorited =
      Array.isArray(favorites) &&
      favorites.findIndex((fav) => fav?.id === book.id) !== -1;

    if (!alreadyFavorited) {
      await addToFavorites(book, userId);
      setFavorites((prev) => [...prev, book]);
      setSuccessMessage(`Kirja "${book.title}" lisättiin suosikkeihin!`);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const totalPages = Math.ceil(totalItems / maxResults);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Hae kirjoja</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Etsi kirjaa..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => searchBooks(0)}
        >
          Hae
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-2xl shadow p-4 flex flex-col items-center hover:shadow-lg transition w-full"
          >
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="mb-3 h-40 w-auto max-w-full object-contain"
              />
            )}
            <h2 className="font-semibold text-center mb-1">{book.title}</h2>
            <p className="text-sm text-gray-700 text-center">
              {book.authors?.join(", ")}
            </p>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded mt-3 w-auto inline-block"
              onClick={() => handleAddToFavorites(book)}
            >
              ⭐ Lisää suosikkeihin
            </button>
          </div>
        ))}
      </div>

      {/* Sivutus */}
      {totalItems > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={page === 0}
            onClick={() => searchBooks(page - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ◀ Edellinen
          </button>

          <span>
            Sivu {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => searchBooks(page + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Seuraava ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
