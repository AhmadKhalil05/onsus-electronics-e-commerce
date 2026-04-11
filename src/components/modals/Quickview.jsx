import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useContextElement } from "@/context/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function Quickview() {
  const [quickviewImages, setQuickviewImages] = useState([
    "/images/store/p1.jpg",
    "/images/store/p1b.jpg",
    "/images/store/p2.jpg",
    "/images/store/p2b.jpg",
    "/images/store/p3.jpg",
  ]);
  const [thumbSwiper, setThumbSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1); // Initial quantity is 1
  const { quickViewItem, addProductToCart, isAddedToCartProducts } =
    useContextElement();
  useEffect(() => {
    const thumbs = quickViewItem?.thumbImages?.filter(Boolean);
    if (thumbs?.length) {
      const next = [...thumbs];
      while (next.length < 5) {
        next.push(next[next.length - 1]);
      }
      setQuickviewImages(next.slice(0, 5));
    } else if (quickViewItem?.imgSrc) {
      setQuickviewImages([
        quickViewItem.imgSrc,
        quickViewItem.imgSrc,
        quickViewItem.imgSrc,
        quickViewItem.imgSrc,
        quickViewItem.imgSrc,
      ]);
    }
  }, [quickViewItem]);

  return (
    <div
      className="modal fade modalCentered modal-def modal-quick-view"
      id="quickView"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content flex-md-row">
          <span
            className="icon-close icon-close-popup link"
            data-bs-dismiss="modal"
          />
          <div className="quickview-image">
            <div className="product-thumb-slider">
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation={{
                  prevEl: ".snbpqv",
                  nextEl: ".snbnqv",
                }}
                className="swiper tf-product-view-main"
                thumbs={{ swiper: thumbSwiper }}
              >
                {quickviewImages.map((elm, i) => (
                  <SwiperSlide key={i} className="swiper-slide">
                    <Link
                      to={`/product-detail/${quickViewItem.id}`}
                      className="d-block tf-image-view"
                    >
                      <img
                        src={elm}
                        alt=""
                        className="lazyload"
                        width={900}
                        height={1000}
                      />
                    </Link>
                  </SwiperSlide>
                ))}

                <div className="swiper-button-prev nav-swiper-2 single-slide-prev snbpqv" />
                <div className="swiper-button-next nav-swiper-2 single-slide-next snbnqv" />
              </Swiper>
              <Swiper
                className="swiper tf-product-view-thumbs"
                data-direction="horizontal"
                onSwiper={setThumbSwiper}
                {...{
                  direction: "horizontal",
                  spaceBetween: 10,
                  slidesPerView: "auto",
                  freeMode: true,
                  watchSlidesProgress: true,
                  observer: true,
                  observeParents: true,
                  nested: true,
                  breakpoints: {
                    0: {
                      direction: "horizontal",
                    },
                  },
                }}
                modules={[FreeMode, Thumbs]}
              >
                {quickviewImages.map((elm, i) => (
                  <SwiperSlide key={i} className="swiper-slide">
                    <div className="item">
                      <img alt="" src={elm} width={900} height={1000} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="quickview-info-wrap">
            <div className="quickview-info-inner">
              <div className="tf-product-info-content">
                <div className="infor-heading">
                  <p className="caption">
                    Categories:
                    <Link to={`/products`} className="link text-secondary">
                      Consumer Electronics
                    </Link>
                  </p>
                  <h5 className="product-info-name fw-semibold">
                    <Link
                      to={`/product-detail/${quickViewItem.id}`}
                      className="link"
                    >
                      {quickViewItem.title ??
                        `Elite Gourmet EKT1001B Electric BPA-Free Glass Kettle,
                      Cordless 360° Base`}
                    </Link>
                  </h5>
                  <ul className="product-info-rate-wrap">
                    <li className="star-review">
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
                          <i className="icon-star" />
                        </li>
                        <li>
                          <i className="icon-star text-main-4" />
                        </li>
                      </ul>
                      <p className="caption text-main-2">Reviews (1.738)</p>
                    </li>
                    <li>
                      <p className="caption text-main-2">Sold: 349</p>
                    </li>
                    <li className="d-flex">
                      <Link
                        to={`/products`}
                        className="caption text-secondary link"
                      >
                        View shop
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="infor-center">
                  <div className="product-info-price">
                    <h4 className="text-primary">
                      ${quickViewItem.price.toFixed(2)}
                    </h4>
                    {quickViewItem.oldPrice && (
                      <span className="price-text text-main-2 old-price">
                        ${quickViewItem.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <ul className="product-fearture-list">
                    <li>
                      <p className="body-md-2 fw-semibold">Brand</p>
                      <span className="body-text-3">Elite Gourmet</span>
                    </li>
                    <li>
                      <p className="body-md-2 fw-semibold">Capacity</p>
                      <span className="body-text-3">1 Liters</span>
                    </li>
                    <li>
                      <p className="body-md-2 fw-semibold">Material</p>
                      <span className="body-text-3">Glass</span>
                    </li>
                    <li>
                      <p className="body-md-2 fw-semibold">Wattage</p>
                      <span className="body-text-3">1100 watts</span>
                    </li>
                  </ul>
                </div>
                <div className="infor-bottom">
                  <h6 className="fw-semibold">About this item</h6>
                  <ul className="product-about-list">
                    <li>
                      <p className="body-text-3">
                        Here’s the quickest way to enjoy your delicious hot tea
                        every single day.
                      </p>
                    </li>
                    <li>
                      <p className="body-text-3">
                        100% BPA - Free premium design meets excellent
                      </p>
                    </li>
                    <li>
                      <p className="body-text-3">
                        So easy convenient that everyone can use it
                      </p>
                    </li>
                    <li>
                      <p className="body-text-3">
                        This powerful 900-1100-Watt kettle has convenient
                        capacity markings on the body lets you accurately
                      </p>
                    </li>
                    <li>
                      <p className="body-text-3">
                        1 year limited warranty and us-based customer support
                        team lets you buy with confidence.
                      </p>
                    </li>
                    <li>
                      <p className="body-text-3">
                        It’s very thin—7.45mm / 0.29″—and starts at just 465g /
                        1.03lbs, thanks to an aluminum chassis that’s both
                        lightweight and durable.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box-quantity-wrap">
                <div className="wg-quantity">
                  <span
                    className="btn-quantity minus-btn"
                    onClick={() =>
                      setQuantity((pre) => (pre == 1 ? pre : pre - 1))
                    }
                  >
                    <i className="icon-minus" />
                  </span>
                  <input
                    className="quantity-product"
                    type="text"
                    name="number"
                    readOnly
                    value={quantity}
                  />
                  <span
                    className="btn-quantity plus-btn"
                    onClick={() => setQuantity((pre) => pre + 1)}
                  >
                    <i className="icon-plus" />
                  </span>
                </div>
                <a
                  href="#shoppingCart"
                  className="tf-btn btn-gray"
                  data-bs-toggle="offcanvas"
                  onClick={() => addProductToCart(quickViewItem.id, quantity)}
                >
                  <span className="text-white">
                    {isAddedToCartProducts(quickViewItem.id)
                      ? "Already Added"
                      : "Add To Cart"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
