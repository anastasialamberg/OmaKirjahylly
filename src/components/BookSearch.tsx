import React, { useState, useEffect, useRef } from "react";
import { addToFavorites, type Book, getFavorites } from "./Favorites";
import searchImage from "../images/undraw_web-search.svg";


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
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest"); 
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxResults = 30;

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
      )}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=newest`
    );

    const data = await res.json();
    setTotalItems(data.totalItems || 0);

    let mappedBooks: Book[] =
      data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || "Nimetön kirja",
        authors: item.volumeInfo.authors,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        publishedDate: item.volumeInfo.publishedDate || "",
        publisher: item.volumeInfo.publisher || "",
      })) || [];

   if (query.trim() !== "") {
  const lowerQuery = query.toLowerCase();
  mappedBooks = mappedBooks.filter((book) => {
    const titleMatch = book.title?.toLowerCase().includes(lowerQuery);
    const authorMatch = book.authors?.some((a) =>
      a?.toLowerCase().includes(lowerQuery)
    );
    return titleMatch || authorMatch;
  });
}

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

  const sortedBooks = [...books].sort((a, b) => {
    const yearA = a.publishedDate ? parseInt(a.publishedDate.slice(0, 4)) : 0;
    const yearB = b.publishedDate ? parseInt(b.publishedDate.slice(0, 4)) : 0;

    if (sortOrder === "newest") {
      return yearB - yearA;
    } else {
      return yearA - yearB;
    }
  });

  return (
    <div className="p-4 mt-20"> 
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

      {books.length > 0 && (
        <div className="mb-4">
          <label className="mr-2 font-medium">Järjestä:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="border rounded p-1"
          >
            <option value="newest">Uusin ensin</option>
            <option value="oldest">Vanhin ensin</option>
          </select>
        </div>
      )}

      {books.length === 0 && (
        <div>
          <img
            src={searchImage}
            alt="Hae kirjoja"
            className="mx-auto w-1/3"
          />
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedBooks.map((book) => (
          <div
            key={book.id}
            className="border rounded-2xl shadow p-2 flex flex-col items-center hover:shadow-lg transition w-full"
          >
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="mb-3 h-32 w-auto max-w-full object-contain"
              />
            )}
            <h3 className="font-semibold text-center text-sm mb-1">{book.title}</h3>
            <p className="text-xs text-gray-700 text-center">
              {book.authors?.join(", ")}
            </p>
            <p className="text-[10px] text-gray-600">
              {book.publisher && `${book.publisher}, `}
              {book.publishedDate?.slice(0, 4)}
            </p>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded mt-2 w-auto inline-block text-xs"
              onClick={() => handleAddToFavorites(book)}
            >
              Lisää suosikkeihin
            </button>
          </div>
        ))}
      </div>

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
