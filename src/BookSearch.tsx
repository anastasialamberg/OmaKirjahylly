import React, { useState, useEffect } from "react";
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

  const maxResults = 10;

  // Lataa käyttäjän suosikit Firebaseesta
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
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      })) || [];

    setBooks(mappedBooks);
    setPage(pageIndex);
  };

const handleAddToFavorites = async (book: Book) => {
  const alreadyFavorited =
    Array.isArray(favorites) &&
    favorites.findIndex((fav) => fav?.id === book.id) !== -1;

  if (!alreadyFavorited) {
    await addToFavorites(book, userId); // pelkkä lisäys Firebasen
    setFavorites((prev) => [...prev, book]); // päivitä paikallinen tila
  }
};


  const totalPages = Math.ceil(totalItems / maxResults);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Hae kirjoja</h1>
      <input
        className="border p-2 mr-2"
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

      <div className="grid grid-cols-2 gap-4 mt-4">
        {books.map((book) => (
          <div key={book.id} className="border p-2 rounded shadow">
            {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
            <h2 className="font-semibold">{book.title}</h2>
            <p>{book.authors?.join(", ")}</p>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded mt-2"
              onClick={() => handleAddToFavorites(book)}
            >
              ⭐ Lisää suosikkeihin
            </button>
          </div>
        ))}
      </div>

      {/* Sivutus */}
      {totalItems > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4">
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
