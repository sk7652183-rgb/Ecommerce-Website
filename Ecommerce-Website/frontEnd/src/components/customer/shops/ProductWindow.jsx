import React, { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getAllCustomerReviewOfProduct } from "../../../api/common/reviews.js";

import ImageSlider from "./ImageSlider.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMedal,
  faMinus,
  faPaperPlane,
  faStar,
  faTrash,
  faWebAwesome,
} from "@fortawesome/free-solid-svg-icons";

import topSizeChart from "../../../assets/top-size-chart.png";
import bottomSizeChart from "../../../assets/bottom-size-chart.webp";
import shoesSizeChart from "../../../assets/shoes-size-chart.webp";

import "../../../styles/customer/component-styles/shops/ProductWindow.css";
import { Link, useNavigate } from "react-router-dom";

// Load product details.
function ProductWindow({ product, setShowState, showEdit = () => {} }) {
  const { isLoggedIn, role } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [option, setOption] = useState(null);
  const [selectedImageIndex, setSelectedIndex] = useState(0);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    async function fetchAllReviews() {
      try {
        const data = await getAllCustomerReviewOfProduct(product.asin);
        setReviews(data);
      } catch (error) {
        console.error("Error Fetching reviews: ", error.message);
      }
    }

    fetchAllReviews();
  }, [product.asin]);

  function imageSizeChart() {
    if (product.categories.includes("top")) {
      return <img src={topSizeChart} alt="top wear size chart" />;
    } else if (product.categories.includes("bottom")) {
      return <img src={bottomSizeChart} alt="bottom wear size chart" />;
    } else if (product.categories.includes("footwear")) {
      return <img src={shoesSizeChart} alt="shoes size chart" />;
    } else {
      return null;
    }
  }

  function validAddToCart() {
    /*
    If you want to force variation selection later, you can enable this:

    if (product.variations && !option) {
      window.alert("Please select an option");
      return false;
    }
    */

    return true;
  }

  // Add product to cart and then navigate to checkout
  async function handleSubmission(event) {
    event.preventDefault();

    if (!validAddToCart()) {
      return;
    }

    try {
      const result = await addToCart({
        id: product.asin + (option ? `-${option}` : ""),
        asin: product.asin,
        name: product.title,
        priceCents: product.price,
        currency: product.currency,
        image: product.image,
        option: option,
      });

      console.log("Product added to cart:", result);

      // Close product window
      setShowState(false);

      // Navigate to checkout after cart update succeeds
      navigate("/check-out");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  }

  function ratingPhotoManage(rating) {
    const ratingPhoto = rating * 10;

    if (ratingPhoto > 0 && ratingPhoto < 10) return 5;
    else if (ratingPhoto > 10 && ratingPhoto < 20) return 15;
    else if (ratingPhoto > 20 && ratingPhoto < 30) return 25;
    else if (ratingPhoto > 30 && ratingPhoto < 40) return 35;
    else if (ratingPhoto > 40 && ratingPhoto < 50) return 45;

    return ratingPhoto;
  }

  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.classList.contains("overlay")) {
        setShowState(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [setShowState]);

  return (
    <div className="overlay">
      <form className="product-window" onSubmit={handleSubmission}>
        <div className="head">
          <FontAwesomeIcon
            icon={faMinus}
            onClick={() => setShowState(false)}
          />
        </div>

        <div className="bottom">
          <div className="image-holder">
            {product.images.length > 1 ? (
              <ImageSlider
                images={product.images}
                selectedImageIndex={selectedImageIndex}
              />
            ) : (
              <img
                className="product-images"
                src={product.image}
                alt="product image1"
              />
            )}
          </div>

          <div className="item-details">
            <div className="top">
              <div className="product-title">
                <h2>{product.title}</h2>

                <p className="product-categories">
                  {product.categories.join(" | ")}
                </p>

                {product.departments && (
                  <p className="product-departments">
                    {product.departments}
                  </p>
                )}

                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      style={{
                        color:
                          i < Math.round(product.rating)
                            ? "#ffc107"
                            : "#e4e5e9",
                      }}
                    />
                  ))}

                  <p
                    style={{
                      display: "inline",
                      marginLeft: 8,
                    }}
                  >
                    {product.rating} <span>({product.sold})</span>
                  </p>
                </div>

                <p>
                  Sell By{" "}
                  <span className="sellerId">
                    {`(${product.sellerId})`}{" "}
                  </span>

                  <Link to={`/sellerShop/${product.sellerId}`}>
                    {product.seller_name}
                  </Link>
                </p>
              </div>

              {isLoggedIn && (
                <>
                  {role === "customer" && (
                    <button
                      className="addToCart-btn"
                      type="submit"
                    >
                      Add to Cart
                    </button>
                  )}

                  {role === "seller" && (
                    <button
                      className="editProduct-btn"
                      type="button"
                      onClick={() => showEdit(true)}
                    >
                      Edit Product Info
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="price">
              {product.currency} {product.price}{" "}
              {product.discount ? `(${product.discount})` : null}
            </div>

            {/* Options for products with variations */}
            {product.variations?.length > 0 && (
              <div className="selection choice">
                <h4>Choice Selections</h4>

                <div className="selection-container">
                  {product.variations.map((optionItem, index) => (
                    <div
                      key={optionItem.asin}
                      className={
                        optionItem.asin === option?.asin
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setOption(optionItem);
                        setSelectedIndex(index);
                      }}
                    >
                      {optionItem.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-details">
              <h4>Details</h4>

              <div className="product-source">
                {product.badge && (
                  <p className="product-badge">
                    {product.badge?.trim()}{" "}
                    <span>
                      {product.badge?.toLowerCase().trim() ===
                        "amazon's choice" && (
                        <FontAwesomeIcon icon={faMedal} />
                      )}

                      {product.badge?.toLowerCase().trim() ===
                        "best seller" && (
                        <FontAwesomeIcon icon={faWebAwesome} />
                      )}
                    </span>
                  </p>
                )}

                <p
                  className={`product-availability ${
                    product.availability
                      ? product.availability.toLowerCase() !==
                          "in stock" &&
                        "availability-warning"
                      : "not-available"
                  }`}
                >
                  {product.availability}
                </p>

                <p>
                  Rank in all category{" "}
                  <span>{product.root_bs_rank}</span>
                </p>

                {product.bs_rank && (
                  <p>
                    Best Selling Rank{" "}
                    <span>{product.bs_rank}</span>
                  </p>
                )}

                {product.subcategory_rank &&
                  product.subcategory_rank.map((category) => (
                    <p key={category.subcategory_name}>
                      Rank in {category.subcategory_name}
                      <span> {category.subcategory_rank}</span>
                    </p>
                  ))}

                <p>
                  Model Number{" "}
                  <span>{product.model_number}</span>
                </p>

                <p>
                  Brand <span>{product.brand}</span>
                </p>

                <p>
                  Manufacturer{" "}
                  <span>{product.manufacturer}</span>
                </p>

                {product.weight && (
                  <p>
                    Weight <span>{product.weight}</span>
                  </p>
                )}

                <p>
                  Dimension <span>{product.dimension}</span>
                </p>

                {product.ingredients && (
                  <p>
                    Ingredients{" "}
                    <span>{product.ingredients}</span>
                  </p>
                )}

                <p>
                  Date first available
                  <span>
                    {" "}
                    {product.date_first_available || "NO RECORD"}
                  </span>
                </p>
              </div>
            </div>

            {product.categories.includes("apparel") ||
            product.categories.includes("footwear") ? (
              <div className="size-chart-container">
                <h4>Size Guide</h4>
                <div className="chart-holder">
                  {imageSizeChart()}
                </div>
              </div>
            ) : null}

            <div className="product-descriptions">
              <h4>Description</h4>
              <p>{product.description}</p>
            </div>

            {Array.isArray(product.features) &&
              product.features.length > 0 && (
                <div className="product-features">
                  <h4>Features</h4>

                  <ul>
                    {product.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="product-reviews-container">
              <h4>Review(s)</h4>

              <ProductReview
                userProfile="https://t3.ftcdn.net/jpg/06/25/95/40/360_F_625954075_LA8kZtScb8QrJtG0JTBv3FZ9wTgXURKY.jpg"
                username="Top Review"
                title=""
                description={reviews?.top_review}
                reviewId={1}
                pin={true}
              />

              {reviews.customer_review?.map((rev) => (
                <ProductReview
                  key={"review-" + rev.review_id}
                  userProfile={
                    rev.customer?.profile_picture ||
                    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  }
                  createAt={rev.created_at}
                  username={`${rev.customer?.first_name || ""} ${
                    rev.customer?.last_name || ""
                  }`}
                  description={rev.comment}
                  reviewId={"review-" + rev.review_id}
                />
              ))}

              {role === "customer" && (
                <form className="add-comment">
                  <input
                    type="text"
                    placeholder="What's your thought about this product?"
                  />

                  <button
                    className="post-comment"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductWindow;

function ProductReview({
  userProfile,
  username,
  description,
  reviewId,
  createAt = "No Record",
  pin = false,
}) {
  const { role } = useAuth();

  return (
    <div
      className={pin ? "product-review pin" : "product-review"}
      key={`review-${reviewId}`}
    >
      <div className="header">
        <div className="review-info">
          <div className="profile-image">
            <img src={userProfile} alt="reviewer profile" />
          </div>

          <div>
            <h2>{username}</h2>
            <p>{createAt}</p>
          </div>
        </div>

        {role === "seller" && (
          <div className="review-action">
            <div className="pin-review">
              <FontAwesomeIcon icon={faStar} />
            </div>

            <div className="delete-review">
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        )}
      </div>

      <p>{description}</p>
    </div>
  );
}
