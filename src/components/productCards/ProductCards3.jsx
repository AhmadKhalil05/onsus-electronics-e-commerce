import { useContextElement } from "@/context/Context";

import { Link } from "react-router-dom";
import React from "react";
import AddToCart from "../common/AddToCart";
import AddToWishlist from "../common/AddToWishlist";
import AddToQuickview from "../common/AddToQuickview";

export default function ProductCards3({ product }) {
  const {
    addToWishlist,
    isAddedtoWishlist,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();
  const productPath = `/product-detail/${encodeURIComponent(String(product.id))}`;

  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <Link to={productPath} className="product-img">
          <img
            className="img-product ls-is-cached lazyloaded"
            src={product.imgSrc}
            data-=""
            alt="image-product"
            width={500}
            height={500}
          />
          <img
            className="img-hover ls-is-cached lazyloaded"
            src={product.imgHover}
            data-=""
            alt="image-product"
            width={500}
            height={500}
          />
        </Link>
        <ul className="list-product-btn top-0 end-0">
          <li>
            <AddToCart productId={product.id} tooltipClass="tooltip-left" />
          </li>
          <li className="wishlist">
            <AddToWishlist productId={product.id} tooltipClass="tooltip-left" />
          </li>
          <li>
            <AddToQuickview
              productId={product.id}
              tooltipClass="tooltip-left"
            />
          </li>
        </ul>
        {product.hotSale && (
          <div className="box-sale-wrap pst-default">
            <p className="small-text">Sale</p>
            <p className="title-sidebar-2">70%</p>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <div className="box-title">
          <div>
            <p className="product-tag caption text-main-2 d-none">Headphone</p>
            <Link
              to={productPath}
              className="name-product body-md-2 fw-semibold text-secondary link"
            >
              {product.title}
            </Link>
          </div>
          <p className="price-wrap fw-medium">
            <span className="new-price price-text fw-medium">
              ${product.price.toFixed(3)}
            </span>
            {product.oldPrice && (
              <span className="old-price body-md-2 text-main-2">
                ${product.oldPrice.toFixed(3)}
              </span>
            )}
          </p>
        </div>
        <div className="box-infor-detail">
          <ul className="list-computer-memory">
            <li>
              <p className="caption">RAM 8GB</p>
            </li>
            <li>
              <p className="caption">SSD 512 GB</p>
            </li>
          </ul>
          <ul className="list-infor-fearture">
            <li>
              <p className="caption name-feature">Screen Size:</p>
              <p className="caption property">13 Inches</p>
            </li>
            <li>
              <p className="caption name-feature">Operating System:</p>
              <p className="caption property">Mac OS</p>
            </li>
            <li>
              <p className="caption name-feature">Graphics Card:</p>
              <p className="caption property">Integrated</p>
            </li>
            <li>
              <p className="caption name-feature">Processor Count:</p>
              <p className="caption property">4</p>
            </li>
          </ul>
          <div className="star-review flex-wrap">
            <ul className="list-star">
              <li>
                <i className="icon-star" />
              </li>
              <li>
                <i className="icon-star" />
              </li>
              <li>
                <i className="icon-star" />
              </li>
              <li>
                <i className="icon-star text-main-4" />
              </li>
              <li>
                <i className="icon-star text-main-4" />
              </li>
            </ul>
            <p className="caption text-main-2">(74)</p>
          </div>
        </div>
      </div>
      <div className="card-product-btn">
        <a
          href="#shoppingCart"
          data-bs-toggle="offcanvas"
          className="tf-btn btn-line w-100"
          onClick={() => addProductToCart(product.id)}
        >
          <span>
            {isAddedToCartProducts(product.id)
              ? "Already Added"
              : "Add to Cart"}
          </span>
          <i className="icon-cart-2" />
        </a>
        <div className="box-btn">
          <a
            href="#"
            onClick={() => addToWishlist(product.id)}
            className="tf-btn-icon style-2 type-black"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.59837 5.26487C3.25014 5.61309 2.97391 6.02649 2.78546 6.48146C2.597 6.93644 2.5 7.42408 2.5 7.91654C2.5 8.409 2.597 8.89664 2.78546 9.35161C2.97391 9.80658 3.25014 10.22 3.59837 10.5682L10 16.9699L16.4017 10.5682C17.105 9.86494 17.5001 8.9111 17.5001 7.91654C17.5001 6.92197 17.105 5.96814 16.4017 5.26487C15.6984 4.5616 14.7446 4.16651 13.75 4.16651C12.7555 4.16651 11.8016 4.5616 11.0984 5.26487L10 6.3632L8.9017 5.26487C8.55348 4.91665 8.14008 4.64042 7.68511 4.45196C7.23013 4.2635 6.74249 4.1665 6.25003 4.1665C5.75757 4.1665 5.26993 4.2635 4.81496 4.45196C4.35998 4.64042 3.94659 4.91665 3.59837 5.26487V5.26487Z"
                stroke="#FF3D3D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="body-text-3 fw-normal">
              {isAddedtoWishlist(product.id) ? "Wishlisted" : "Wishlist"}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
