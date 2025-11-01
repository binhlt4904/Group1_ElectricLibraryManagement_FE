import React from 'react';
import { Row, Col, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { Search, SortDown } from 'react-bootstrap-icons';
import styles from '../../../pages/public/BookListPage.module.css';
const SearchAndFilterBook = ({ searchTerm, handleSearch, setSearchTerm, selectedCategory, setSelectedCategory,
    categories, sortBy, setSortBy, sortDirection, setSortDirection, setCurrentPage }) => {
    return (
        <div>
            <Row className="mb-4">
                <Col lg={8} className="mb-3">
                    <Form onSubmit={handleSearch}>
                        <InputGroup size="lg">
                            <Form.Control
                                type="text"
                                placeholder="Search books by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <Button type='submit' variant="primary">
                                <Search />
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col lg={4}>
                    <Row>
                        <Col sm={6} className="mb-2">
                            <Form.Select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                                size="lg"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col sm={6} className="mb-2">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" size="lg" className="w-100">
                                    <SortDown className="me-2" />
                                    Sort by {sortBy === 'publishedDate' ? 'Date' : (sortBy.charAt(0).toUpperCase() + sortBy.slice(1))}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setSortBy('title')}>Title</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSortBy('author')}>Author</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSortBy('publishedDate')}>Date</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                                        {sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default SearchAndFilterBook;