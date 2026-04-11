import React from "react";
import { Link } from "react-router-dom";

import { useContextElement } from "@/context/Context";
export default function ShopCart() {
  const {
    cartProducts,
    setCartProducts,
    totalPrice,

    updateQuantity,
  } = useContextElement();

  const removeItem = (id) => {
    setCartProducts((pre) => [...pre.filter((elm) => elm.id != id)]);
  };

  return (
    <div className="s-shoping-cart tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar first" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link to={`/cart`} className="text-secondary body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link to={`/checkout`} className="link-secondary body-text-3">
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link
                to={`/order-success`}
                className="link-secondary body-text-3"
              >
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="form-discount">
          <div className="overflow-x-auto">
            {cartProducts.length ? (
              <table className="tf-table-page-cart">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((product, i) => (
                    <tr key={i} className="tf-cart-item">
                      <td className="tf-cart-item_product">
                        <a href="#" className="img-box">
                          <img
                            alt=""
                            src={product.imgSrc}
                            width={300}
                            height={300}
                          />
                        </a>
                        <div className="cart-info">
                          <a
                            href="#"
                            className="cart-title body-md-2 fw-semibold link"
                          >
                            {product.title}
                          </a>
                          <div className="variant-box">
                            <p className="body-text-3">Color:</p>
                            <div className="tf-select">
                              <select>
                                <option>Yellow</option>
                                <option>Green</option>
                                <option>Black</option>
                                <option>Red</option>
                                <option>Beige</option>
                                <option>Pink</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        data-cart-title="Price"
                        className="tf-cart-item_price"
                      >
                        <p className="cart-price price-on-sale price-text fw-medium">
                          ${product.price.toFixed(2)}
                        </p>
                      </td>
                      <td
                        data-cart-title="Quantity"
                        className="tf-cart-item_quantity"
                      >
                        <div className="wg-quantity">
                          <span
                            className="btn-quantity btn-decrease"
                            onClick={() =>
                              updateQuantity(product.id, product.quantity - 1)
                            }
                          >
                            <i className="icon-minus" />
                          </span>
                          <input
                            className="quantity-product"
                            type="text"
                            name="number"
                            value={product.quantity}
                            readOnly
                          />
                          <span
                            className="btn-quantity btn-increase"
                            onClick={() =>
                              updateQuantity(product.id, product.quantity + 1)
                            }
                          >
                            <i className="icon-plus" />
                          </span>
                        </div>
                      </td>
                      <td
                        data-cart-title="Total"
                        className="tf-cart-item_total"
                      >
                        <p className="cart-total total-price price-text fw-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </td>
                      <td
                        data-cart-title="Remove"
                        className="remove-cart text-xxl-end"
                      >
                        <span
                          className="remove icon icon-close link"
                          onClick={() => removeItem(product.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4">
                <div className="col-4">
                  Your Cart is empty. Start adding favorite products to cart!{" "}
                </div>
                <Link
                  className="tf-btn mt-2 mb-3 text-white"
                  style={{ width: "fit-content" }}
                  href="/products"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>
          <div className="cart-bottom">
            <div className="ip-discount-code">
              <input
                type="text"
                placeholder="Enter your cupon code"
                required=""
              />
              <button type="submit" className="tf-btn btn-gray">
                <span className="text-white">Apply coupon</span>
              </button>
            </div>
            <span className="last-total-price main-title fw-semibold">
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>
        </form>
        <div className="box-btn">
          <Link to={`/product-grid`} className="tf-btn btn-gray">
            <span className="text-white">Continue shopping</span>
          </Link>
          <Link to={`/checkout`} className="tf-btn">
            <span className="text-white">Proceed to checkout</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
