import React, { useEffect, useState } from "react";
import BookCard from '../../components/commons/BookCard/BookCard';

export default function WishlistPage() {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  
  useEffect(() => {
    
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    setAllBooks(books);
  }, []);

 
  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const favBooks = allBooks.filter((b) => favIds.includes(b.id));
    setWishlistBooks(favBooks);
  }, [allBooks]);

  return (
    <div className="container mt-4">
      <h3>❤️ My Wishlist</h3>
      <div className="d-flex flex-wrap gap-3">
        {wishlistBooks.length === 0 ? (
          <p>No favorite books yet.</p>
        ) : (
          wishlistBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
}
