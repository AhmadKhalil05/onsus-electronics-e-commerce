import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const categories = [
  { rel: "", label: "All categories" },
  { rel: "Audio", label: "Audio" },
  { rel: "Mobile", label: "Mobile" },
  { rel: "Computers", label: "Computers" },
  { rel: "Wearables", label: "Wearables" },
  { rel: "Gaming", label: "Gaming" },
  { rel: "Cameras", label: "Cameras" },
  { rel: "Accessories", label: "Accessories" },
  { rel: "Electronics", label: "Electronics" },
];

export default function SearchForm({
  parentClass = "form-search-product style-2",
}) {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchText, setSearchText] = useState("");
  const navRef = useRef(null);
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const text = searchText.trim();
    if (text) params.set("search", text);
    if (activeCategory?.rel) params.set("category", activeCategory.rel);
    const qs = params.toString();
    navigate(qs ? `/products?${qs}` : "/products");
  };

  return (
    <form
      ref={navRef}
      onSubmit={handleSubmit}
      className={parentClass}
    >
      <div className={`select-category ${activeDropdown ? "active" : ""}`}>
        <div
          onClick={() => setActiveDropdown(true)}
          className="tf-select-custom"
        >
          {activeCategory.label}
        </div>
        <ul
          className="select-options"
          style={{ display: activeDropdown ? "block" : "none" }}
        >
          <div className="header-select-option">
            <span>Select Categories</span>
            <span
              className="close-option"
              onClick={() => setActiveDropdown(false)}
            >
              <i className="icon-close"></i>
            </span>
          </div>
          {categories.map((item, index) => (
            <li
              rel={item.rel}
              onClick={() => {
                setActiveCategory(item);
                setActiveDropdown(false);
              }}
              key={index}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <ul className="select-options">
          <li className="link" rel="">
            <span>All categories</span>
          </li>
          <li className="link" rel="apple-products">
            <span>Apple products</span>
          </li>
          <li className="link" rel="audio-equipments">
            <span>Audio Equipments</span>
          </li>
          <li className="link" rel="camera-video">
            <span>Camera &amp; Video</span>
          </li>
          <li className="link" rel="game-room-furniture">
            <span>Game &amp; Room Furniture</span>
          </li>
          <li className="link" rel="gaming-accessories">
            <span>Gaming Accessories</span>
          </li>
          <li className="link" rel="headphone">
            <span>Headphone</span>
          </li>
          <li className="link" rel="laptop-tablet">
            <span>Laptop &amp; Tablet</span>
          </li>
          <li className="link" rel="server-workstation">
            <span>Server &amp; Workstation</span>
          </li>
          <li className="link" rel="smartphone">
            <span>Smartphone</span>
          </li>
          <li className="link" rel="smartwatch">
            <span>Smartwatch</span>
          </li>
          <li className="link" rel="storage-digital-devices">
            <span>Storage &amp; Digital Devices</span>
          </li>
          <li className="link" rel="tv-computer-screen">
            <span>TV &amp; Computer Screen</span>
          </li>
        </ul>
      </div>
      <span className="br-line type-vertical bg-line"></span>
      <fieldset>
        <input
          type="text"
          placeholder="Search for products"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </fieldset>
      <button type="submit" className="btn-submit-form">
        <i className="icon-search"></i>
      </button>
    </form>
  );
}
