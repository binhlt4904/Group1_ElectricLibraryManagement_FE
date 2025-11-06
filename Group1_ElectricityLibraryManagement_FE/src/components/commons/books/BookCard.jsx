import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import { Heart, HeartFill, Star, StarFill } from "react-bootstrap-icons";
import styles from "./BookCard.module.css";

import UserContext from "../../contexts/UserContext";

const BookCard = ({
  book,
  onWishlistToggle, // optional callback
  showRating = true,
  isInWishlist: externalWishlist = false, // hỗ trợ nếu truyền từ ngoài
}) => {
  const { user } = useContext(UserContext);
  const { id, title, author, image, isDeleted, category, publishedDate, starRating, reviewCount } = book;

  /** ❤️ Kiểm tra sách có trong localStorage không */
  const [isInWishlist, setIsInWishlist] = useState(externalWishlist);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsInWishlist(saved.includes(id));
  }, [id]);

  /** 🩷 Toggle yêu thích (lưu trong localStorage + callback) */
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("⚠️ Please login to use favorites!");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;

    if (saved.includes(id)) {
      updated = saved.filter((bid) => bid !== id);
      setIsInWishlist(false);
    } else {
      updated = [...saved, id];
      setIsInWishlist(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    onWishlistToggle?.(book); 
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<StarFill key={i} className={styles.starFilled} />);
      else if (i === fullStars && hasHalfStar)
        stars.push(<Star key={i} className={styles.starHalf} />);
      else stars.push(<Star key={i} className={styles.starEmpty} />);
    }
    return stars;
  };

  return (
    <Link to={`/books/${id}`} className={styles.bookCardLink}>
      <Card className={`custom-card ${styles.bookCard}`}>
        {/* 🖼️ Hình ảnh & nút tim */}
        <div className={styles.imageContainer}>
          <Card.Img
            variant="top"
            src={
              image
                ? `http://localhost:8080${image}`
                : "https://via.placeholder.com/300x400?text=No+Cover"
            }
            alt={`${title} cover`}
            className={styles.bookCover}
          />
          <Button
            variant="link"
            className={styles.wishlistButton}
            onClick={handleWishlistClick}
            aria-label={isInWishlist ? "Remove from favorites" : "Add to favorites"}
          >
            {isInWishlist ? (
              <HeartFill className={styles.heartFilled} />
            ) : (
              <Heart className={styles.heartEmpty} />
            )}
          </Button>
        </div>

        {/* 📘 Thông tin sách */}
        <Card.Body className={styles.cardBody}>
          <Card.Title className={styles.bookTitle} title={title}>
            {title}
          </Card.Title>

          <Card.Subtitle className={styles.bookAuthor} title={author}>
            by {author}
          </Card.Subtitle>

          {/* ⭐ Rating */}
          {showRating && (
            <div className={styles.ratingContainer}>
              <div className={styles.stars}>{renderStars(book.starRating)}</div>
              <span className={styles.ratingText}>{starRating} ({reviewCount} review)</span>
            </div>
          )}

          {/* 🏷️ Category & năm xuất bản */}
          <div className={styles.bookMeta}>
            {category && (
              <Badge bg="light" text="dark" className={styles.categoryBadge}>
                {category}
              </Badge>
            )}
            {publishedDate && (
              <span className={styles.publishYear}>{publishedDate}</span>
            )}
          </div>

          {/* 🔘 Nút hành động */}
            <div className={styles.cardActions}>
              <Button
                variant="primary"
                size="sm"
                className={styles.actionButton}
                disabled={isDeleted === "unavailable"}
              > View Details
              </Button>
            </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default BookCard;
