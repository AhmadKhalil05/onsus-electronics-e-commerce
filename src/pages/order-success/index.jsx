import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { Link } from "react-router-dom";
import React from "react";

const metadata = {
  title: "Order placed — Onsus Electronics",
  description: "Thank you — demo checkout complete.",
};

export default function OrderSuccessPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-3 text-center">
        <div className="container" style={{ maxWidth: 560 }}>
          <img
            src="/images/store/p3.jpg"
            alt=""
            width={200}
            height={200}
            className="rounded-3 mb-4 mx-auto d-block object-fit-cover"
            style={{ width: 200, height: 200, objectFit: "cover" }}
          />
          <h1 className="h3 fw-bold mb-3">Thank you — order simulated</h1>
          <p className="body-text-3 text-main-2 mb-4">
            This is a frontend-only demo. No payment was processed and no order
            was sent to a server. Your cart is still in the browser until you
            clear it.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/products" className="tf-btn">
              <span className="text-white">Continue shopping</span>
            </Link>
            <Link to="/cart" className="tf-btn btn-line">
              <span className="body-md-2 fw-semibold">View cart</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
