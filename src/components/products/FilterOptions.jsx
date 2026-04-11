import { brands } from "@/data/filterOptions";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function FilterOptions({ allProps }) {
  const [priceRange, setPriceRange] = useState([null, null]); // [min, max]

  const handleInputChange = (e, index) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You might want to validate that min <= max here
    if (
      priceRange[0] !== null &&
      priceRange[1] !== null &&
      priceRange[0] < priceRange[1]
    ) {
      allProps.setPrice(priceRange);
    }
    // Proceed with your filtering logic
  };

  return (
    <>
      <div className="facet-categories">
        <h6 className="title fw-medium">Categories</h6>
        <ul>
          <li>
            <Link to="/products" className="link">
              All electronics <i className="icon-arrow-right" />
            </Link>
          </li>
          <li>
            <Link to="/products" className="link">
              Audio &amp; headphones <i className="icon-arrow-right" />
            </Link>
          </li>
          <li>
            <Link to="/products" className="link">
              Computers &amp; accessories <i className="icon-arrow-right" />
            </Link>
          </li>
          <li>
            <Link to="/products" className="link">
              Gaming <i className="icon-arrow-right" />
            </Link>
          </li>
        </ul>
      </div>
      <div className="widget-facet facet-fieldset has-loadmore">
        <p className="facet-title title-sidebar fw-semibold">Brand</p>
        <div className="box-fieldset-item">
          {brands.map((brand) => (
            <fieldset
              key={brand.id}
              onClick={() => allProps.setBrands(brand.id)}
              className="fieldset-item"
            >
              <input
                type="checkbox"
                className="tf-check"
                readOnly
                checked={allProps.brands.includes(brand.id)}
              />
              <label>{brand.label}</label>
            </fieldset>
          ))}
        </div>
        <div className="btn-loadmore">
          See more <i className="icon-arrow-down" />
        </div>
      </div>
      <div className="widget-facet facet-price">
        <p className="facet-title title-sidebar fw-semibold">Price</p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setPrice([0, 99])}
          >
            <input
              type="radio"
              checked={allProps.price[1] <= 99 && allProps.price[0] === 0}
              readOnly
              className="tf-check"
            />
            <label>Under $100</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setPrice([100, 299])}
          >
            <input
              checked={
                allProps.price[0] >= 100 && allProps.price[1] <= 299
              }
              type="radio"
              readOnly
              className="tf-check"
            />
            <label>$100 – $299</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setPrice([300, 699])}
          >
            <input
              type="radio"
              checked={
                allProps.price[0] >= 300 && allProps.price[1] <= 699
              }
              className="tf-check"
              readOnly
            />
            <label>$300 – $699</label>
          </fieldset>
          <fieldset
            className="fieldset-item "
            onClick={() => allProps.setPrice([700, 1200])}
          >
            <input
              type="radio"
              checked={allProps.price[0] >= 700}
              className="tf-check"
              readOnly
            />
            <label>$700 &amp; above</label>
          </fieldset>
        </div>
        <div className="box-price-product">
          <form onSubmit={handleSubmit} className="w-100 form-filter-price">
            <div className="cols w-100">
              <fieldset className="box-price-item">
                <input
                  type="number"
                  className="min-price price-input"
                  value={priceRange[0] ?? ""}
                  onChange={(e) => handleInputChange(e, 0)}
                  min={0}
                  max={1200}
                  placeholder="$ Min"
                />
              </fieldset>
              <span className="br-line" />
              <fieldset className="box-price-item">
                <input
                  type="number"
                  className="max-price price-input"
                  value={priceRange[1] ?? ""}
                  onChange={(e) => handleInputChange(e, 1)}
                  placeholder="$ Max"
                  min={0}
                  max={1200}
                />
              </fieldset>
            </div>
            <button type="submit" className="btn-filter-price cs-pointer link">
              <span className="title-sidebar fw-bold">Go</span>
            </button>
          </form>
        </div>
      </div>
      <div className="widget-facet facet-vote">
        <p className="facet-title title-sidebar fw-semibold">Customer Review</p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(5)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 5}
            />
            <label>
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
              </span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(4)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 4}
            />
            <label htmlFor="fourStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(3)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 3}
            />
            <label htmlFor="threeStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(2)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 2}
            />
            <label htmlFor="twoStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setRating(1)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.rating == 1}
            />
            <label htmlFor="oneStar">
              <span className="list-star">
                <i className="icon-star" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
                <i className="icon-star text-main-4" />
              </span>
              <span className="body-text-3">&amp; Up</span>
            </label>
          </fieldset>
        </div>
      </div>
      <div className="widget-facet facet-fieldset">
        <p className="facet-title title-sidebar fw-semibold">Condition</p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setIsNew(true)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.isNew == true}
            />
            <label>New</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setIsNew(false)}
          >
            <input
              type="radio"
              className="tf-check"
              readOnly
              checked={allProps.isNew == false}
            />
            <label>Used</label>
          </fieldset>
        </div>
      </div>
      <div className="widget-facet facet-fieldset">
        <p className="facet-title title-sidebar fw-semibold">
          Deals & Discounts
        </p>
        <div className="box-fieldset-item">
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setDeals("All Discounts")}
          >
            <input
              type="radio"
              checked={allProps.deals == "All Discounts"}
              readOnly
              className="tf-check"
            />
            <label>All Discounts</label>
          </fieldset>
          <fieldset
            className="fieldset-item"
            onClick={() => allProps.setDeals("Today’s Deals")}
          >
            <input
              type="radio"
              className="tf-check"
              checked={allProps.deals == "Today’s Deals"}
              readOnly
            />
            <label>Today’s Deals</label>
          </fieldset>
        </div>
      </div>
    </>
  );
}
