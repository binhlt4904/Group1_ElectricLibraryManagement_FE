import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Dropdown, Pagination } from 'react-bootstrap';
import { Search, Filter, Grid3x3Gap, List, SortDown } from 'react-bootstrap-icons';
import BookCard from '../../components/commons/BookCard/BookCard';
import styles from './BookListPage.module.css';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [wishlist, setWishlist] = useState(new Set());

  // Mock data - replace with API call
  useEffect(() => {
    const mockBooks = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
        rating: 4.2,
        totalRatings: 1250,
        availability: "available",
        category: "Classic Literature",
        publishYear: 1925
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        rating: 4.5,
        totalRatings: 2100,
        availability: "borrowed",
        category: "Classic Literature",
        publishYear: 1960
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        rating: 4.3,
        totalRatings: 1800,
        availability: "available",
        category: "Science Fiction",
        publishYear: 1949
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
        rating: 4.4,
        totalRatings: 1650,
        availability: "reserved",
        category: "Romance",
        publishYear: 1813
      },
      {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop",
        rating: 3.8,
        totalRatings: 980,
        availability: "available",
        category: "Coming of Age",
        publishYear: 1951
      },
      {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        coverImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=300&h=400&fit=crop",
        rating: 4.7,
        totalRatings: 3200,
        availability: "available",
        category: "Fantasy",
        publishYear: 1997
      }
    ];
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = books;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Availability filter
    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(book => book.availability === selectedAvailability);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.publishYear - a.publishYear;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [books, searchTerm, selectedCategory, selectedAvailability, sortBy]);

  const handleWishlistToggle = (book) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(book.id)) {
      newWishlist.delete(book.id);
    } else {
      newWishlist.add(book.id);
    }
    setWishlist(newWishlist);
  };



  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const categories = ['all', ...new Set(books.map(book => book.category))];
  const availabilityOptions = ['all', 'available', 'borrowed', 'reserved'];

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
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <Button variant="primary">
                <Search />
              </Button>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Row>
              <Col sm={4} className="mb-2">
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="lg"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={4} className="mb-2">
                <Form.Select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  size="lg"
                >
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All Status' : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={4} className="mb-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" size="lg" className="w-100">
                    <SortDown className="me-2" />
                    Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy('title')}>Title</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('author')}>Author</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('rating')}>Rating</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('year')}>Year</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Results Info and View Toggle */}
        <Row className="mb-3 align-items-center">
          <Col>
            <p className={styles.resultsInfo}>
              Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
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
          {currentBooks.map(book => (
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
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default BookListPage;
