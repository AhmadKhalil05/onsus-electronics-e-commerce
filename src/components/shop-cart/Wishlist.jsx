import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useContextElement } from "@/context/Context";
import { useCatalog } from "@/context/CatalogContext";

export default function Wishlist() {
  const { products } = useCatalog();
  const {
    wishList,
    removeFromWishlist,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems([
      ...products.filter((elm) =>
        wishList.some((w) => String(w) === String(elm.id))
      ),
    ]);
  }, [wishList, products]);
  return (
    <div className="tf-sp-2">
      <div className="container">
        <div className="tf-wishlist">
          {items.length ? (
            <table className="tf-table-wishlist">
              <thead>
                <tr>
                  <th className="wishlist-item_remove" />
                  <th className="wishlist-item_image" />
                  <th className="wishlist-item_info">
                    <p className="product-title fw-semibold">Product Name</p>
                  </th>
                  <th className="wishlist-item_price">
                    <p className="product-title fw-semibold">Unit Price</p>
                  </th>
                  <th className="wishlist-item_stock">
                    <p className="product-title fw-semibold">Stock Status</p>
                  </th>
                  <th className="wishlist-item_action" />
                </tr>
              </thead>
              <tbody>
                {items.map((product, i) => (
                  <tr key={i} className="wishlist-item">
                    <td
                      className="wishlist-item_remove"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <i className="icon-close remove link cs-pointer" />
                    </td>
                    <td className="wishlist-item_image">
                      <Link to={`/product-detail/${product.id}`}>
                        <img
                          src={product.imgSrc}
                          alt="Image"
                          className="lazyload"
                          width={500}
                          height={500}
                        />
                      </Link>
                    </td>
                    <td className="wishlist-item_info">
                      <Link
                        className="text-line-clamp-2 body-md-2 fw-semibold text-secondary link"
                        to={`/product-detail/${product.id}`}
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="wishlist-item_price">
                      <p className="price-wrap fw-medium flex-nowrap">
                        <span className="new-price price-text fw-medium mb-0">
                          ${product.price.toFixed(3)}
                        </span>
                        {product.oldPrice && (
                          <span className="old-price body-md-2 text-main-2 fw-normal">
                            ${product.oldPrice.toFixed(3)}
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="wishlist-item_stock">
                      <span className="wishlist-stock-status">In Stock</span>
                    </td>
                    <td className="wishlist-item_action">
                      <a
                        href="#shoppingCart"
                        data-bs-toggle="offcanvas"
                        className="tf-btn btn-gray"
                        onClick={() => addProductToCart(product.id)}
                      >
                        <span className="text-white">
                          {isAddedToCartProducts(product.id)
                            ? "Already Added"
                            : "Add to Cart"}
                        </span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="d-none">
                <tr>
                  <td colSpan={6} className="text-center">
                    No products added to the wishlist
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="p-4">
              <div className="col-4">
                Your wishlist is empty. Start adding favorite products to
                wishlist!{" "}
              </div>
              <Link
                className="tf-btn mt-2 mb-3 text-white"
                style={{ width: "fit-content" }}
                to="/products"
              >
                Explore Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
