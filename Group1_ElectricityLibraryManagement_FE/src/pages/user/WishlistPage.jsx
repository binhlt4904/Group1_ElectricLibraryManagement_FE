import React, { useEffect, useState } from "react";
import BookCard from '../../components/commons/books/BookCard';
import bookApi from '../../api/book';
import {Row, Col } from "react-bootstrap";

export default function WishlistPage() {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  const fetchBooks = async () => {
    const res = await bookApi.findListBook();
    console.log(res.data)
    setAllBooks(res.data);
  };
  useEffect(() => {
    
    fetchBooks();
  }, []);

 
  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    console.log(favIds);
    console.log(allBooks);
    const favBooks = allBooks.filter((b) => favIds.includes(b.id));
    setWishlistBooks(favBooks);
  }, [allBooks]);

  return (
    <div className="container mt-4">
      <h3>❤️ My Wishlist</h3>
      <div className="d-flex flex-wrap gap-3">
        <Row>
        {wishlistBooks.length === 0 ? (
          <p>No favorite books yet.</p>
        ) : (

          wishlistBooks.map((book) => (
            
            <Col
              key={book.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
            >
              <BookCard key={book.id} book={book} />
            </Col>
           
            
          ))
        )}
         </Row>
      </div>
    </div>
  );
}
