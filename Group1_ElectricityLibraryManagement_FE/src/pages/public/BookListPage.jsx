import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Dropdown, Pagination } from 'react-bootstrap';
import { Search, Filter, Grid3x3Gap, List, SortDown } from 'react-bootstrap-icons';
import BookCard from '../../components/commons/books/BookCard';
import styles from './BookListPage.module.css';
import bookApi from '../../api/book';
import SearchAndFilterBook from '../../components/commons/books/SearchAndFilterBook';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [wishlist, setWishlist] = useState(new Set());

  // Mock data - replace with API call
  const fetchBooks = async () => {
    try {
      const params = {
        page: currentPage - 1, // backend dùng page = 0-based
        size: itemsPerPage,
        sortBy: sortBy,
        direction: sortDirection
      };

      if (searchTerm.trim() !== '') params.search = searchTerm.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const response = await bookApi.findAll(params);
      const data = response.data;

      if (searchTerm.trim() === '' && selectedCategory === 'all') {
        const uniqueCategories = [...new Set(data.content.map((book) => book.category))];
        setCategories(uniqueCategories);
      }
      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    }
    catch (error) {
      console.error("Error fetching books:", error);
    }
  };


  // Filter and search logic
  useEffect(() => {
    console.log("aaa")
    fetchBooks();
  }, [currentPage, selectedCategory, sortBy, sortDirection]);
  console.log(books)

  const handleWishlistToggle = (book) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(book.id)) {
      newWishlist.delete(book.id);
    } else {
      newWishlist.add(book.id);
    }
    setWishlist(newWishlist);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("aaa")
    setCurrentPage(1);
    fetchBooks();
  };

  return (
    <div className={styles.bookListPage}>
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className={styles.pageTitle}>Browse Books</h1>
            <p className={styles.pageSubtitle}>
              Discover your next favorite book from our extensive collection
            </p>
          </Col>
        </Row>

        {/* Search and Filters */}
        <SearchAndFilterBook
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          setCurrentPage={setCurrentPage}
        />

        {/* Results Info and View Toggle */}
        <Row className="mb-3 align-items-center">
          <Col>
            <p className={styles.resultsInfo}>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} books
            </p>
          </Col>
          <Col xs="auto">
            <div className={styles.viewToggle}>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3Gap />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="ms-2"
              >
                <List />
              </Button>
            </div>
          </Col>
        </Row>

        {/* Books Grid */}
        <Row>
          {books.map(book => (
            <Col
              key={book.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
            >
              <BookCard
                book={book}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={wishlist.has(book.id)}
              />
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <Pagination>
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BookListPage;
