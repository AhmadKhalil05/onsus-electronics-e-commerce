import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { purchaseClient } from "@/api/http";
import { API_ROUTES } from "@/config/api";
import { useContextElement } from "@/context/Context";
export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const {
    cartProducts,
    setCartProducts,
    totalPrice,
  } = useContextElement();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartProducts.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // The Lambda handles everything server-side using the sub from JWT
      const response = await purchaseClient.post(API_ROUTES.purchase);
      
      if (response.status === 200) {
        setCartProducts([]); // Clear local cart
        navigate("/order-success", { state: { orderId: response.data.orderId } });
      }
    } catch (err) {
      console.error("Purchase failed:", err);
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar next" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link to={`/cart`} className="link body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link
                to={`/checkout`}
                className="text-secondary link body-text-3"
              >
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link to={`/order-success`} className="link body-text-3">
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <div className="tf-checkout-wrap flex-lg-nowrap">
          <div className="page-checkout">
            <div className="wrap">
              <h5 className="title has-account">
                <span className="fw-semibold">Contact</span>
                <span className="body-text-3">
                  Have an account?
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="body-text-3 text-secondary link"
                  >
                    Login
                  </a>
                </span>
              </h5>
              <form action="#" className="form-checkout-contact">
                <label className="body-md-2 fw-semibold">Email or Phone</label>
                <input
                  className="def"
                  type="text"
                  placeholder="Your contact"
                  required=""
                />
                <p className="caption text-main-2 font-2">
                  Order information will be sent to your email
                </p>
              </form>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Delivery</h5>
              <form action="#" className="def">
                <fieldset>
                  <label>Country/Region</label>
                  <div className="tf-select">
                    <select>
                      <option>Select your Country/Region</option>
                      <option>American</option>
                    </select>
                  </div>
                </fieldset>
                <div className="cols">
                  <fieldset>
                    <label>First name</label>
                    <input type="text" placeholder="e.g. Jonn" required="" />
                  </fieldset>
                  <fieldset>
                    <label>Last name</label>
                    <input type="text" placeholder="e.g. Doe" required="" />
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset>
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="e.g. New York"
                      required=""
                    />
                  </fieldset>
                  <fieldset>
                    <label>State</label>
                    <div className="tf-select">
                      <select>
                        <option>Select</option>
                        <option>Alabam</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Georgia</option>
                        <option>Washington</option>
                      </select>
                    </div>
                  </fieldset>
                  <fieldset>
                    <label>ZIP code</label>
                    <input type="text" placeholder="e.g. 83254" required="" />
                  </fieldset>
                </div>
                <fieldset>
                  <label>Address</label>
                  <input
                    type="email"
                    placeholder="Your detailed address"
                    required=""
                  />
                </fieldset>
                <fieldset>
                  <label>Order note</label>
                  <textarea
                    placeholder="Note on your order"
                    defaultValue={""}
                  />
                </fieldset>
              </form>
            </div>
            <div className="wrap">
              <h5 className="title">Payment</h5>
              <form action="#" className="form-payment">
                <div className="payment-box" id="payment-box">
                  <div className="payment-item payment-choose-card active">
                    <label
                      htmlFor="credit-card-method"
                      className="payment-header"
                      data-bs-toggle="collapse"
                      data-bs-target="#credit-card-payment"
                      aria-controls="credit-card-payment"
                      aria-expanded="true"
                    >
                      <span className="body-md-2 fw-semibold title">
                        Select payment method
                      </span>
                      <input
                        type="radio"
                        name="payment-method"
                        className="d-none tf-check-rounded"
                        id="credit-card-method"
                        defaultChecked=""
                      />
                      <p className="select-payment">Mastercard</p>
                    </label>
                    <div
                      id="credit-card-payment"
                      className="collapse show"
                      data-bs-parent="#payment-box"
                    >
                      <div className="payment-body">
                        <fieldset>
                          <label>Credit Card number</label>
                          <input
                            type="text"
                            className="number-credit-card"
                            placeholder="xxxx   xxxx   xxxx   xxxx"
                          />
                        </fieldset>
                        <div className="cols">
                          <fieldset>
                            <label>Expiration date</label>
                            <input type="date" />
                          </fieldset>
                          <fieldset>
                            <label>CVV</label>
                            <input type="number" placeholder="xxx" />
                          </fieldset>
                        </div>
                        <fieldset>
                          <label>Name on card</label>
                          <input type="text" placeholder="e.g. JOHNDOE" />
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div className="payment-item">
                    <label
                      htmlFor="delivery-method"
                      className="payment-header radio-item collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#delivery-payment"
                      aria-controls="delivery-payment"
                      aria-expanded="false"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        className="tf-check-rounded"
                        id="delivery-method"
                      />
                      <span className="body-text-3">Cash on delivery</span>
                    </label>
                    <div
                      id="delivery-payment"
                      className="collapse"
                      data-bs-parent="#payment-box"
                    />
                  </div>
                </div>
                <div className="box-btn">
                  {error && (
                    <div className="alert alert-danger small py-2 mb-3">
                      {error}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || cartProducts.length === 0}
                    className="tf-btn w-100 border-0"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <span className="text-white">
                      {isProcessing ? "Processing..." : "Place order"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flat-sidebar-checkout">
            <div className="sidebar-checkout-content">
              <h5 className="fw-semibold">Order Summary</h5>
              {cartProducts.length ? (
                <ul className="list-product">
                  {cartProducts.map((product, i) => (
                    <li key={i} className="item-product">
                      <a href="#" className="img-product">
                        <img
                          alt=""
                          src={product.imgSrc}
                          width={500}
                          height={500}
                        />
                      </a>
                      <div className="content-box">
                        <a
                          href="#"
                          className="link-secondary body-md-2 fw-semibold"
                        >
                          {product.title}
                        </a>
                        <p className="price-quantity price-text fw-semibold">
                          ${product.price.toFixed(2)}
                          <span className="body-md-2 text-main-2 fw-normal">
                            X{product.quantity}
                          </span>
                        </p>
                        <p className="body-md-2 text-main-2">Gray</p>
                      </div>
                    </li>
                  ))}
                </ul>
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
              <div className="">
                <p className="body-md-2 fw-semibold sub-type">Discount code</p>
                <form action="#" className="ip-discount-code style-2">
                  <input
                    type="text"
                    className="def"
                    placeholder="Your code"
                    required=""
                  />
                  <button type="submit" className="tf-btn btn-gray-2">
                    <span>Apply</span>
                  </button>
                </form>
              </div>
              <ul className="sec-total-price">
                <li>
                  <span className="body-text-3">Sub total</span>
                  <span className="body-text-3">${totalPrice.toFixed(2)}</span>
                </li>
                <li>
                  <span className="body-text-3">Shipping</span>
                  <span className="body-text-3">Free shipping</span>
                </li>
                <li>
                  <span className="body-md-2 fw-semibold">Total</span>
                  <span className="body-md-2 fw-semibold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
