import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { Link } from "react-router-dom";
import React from "react";

const metadata = {
  title: "Onsus Electronics — Home",
  description: "Shop electronics, manage your cart, and contact us.",
};

export default function HomePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-2">
        <div className="container">
          <div className="row align-items-center g-4 g-xl-5">
            <div className="col-lg-6">
              <p className="caption text-primary fw-semibold mb-2">
                Demo electronics store
              </p>
              <h1 className="fw-bold mb-3">
                Everything for your desk, pocket, and living room
              </h1>
              <p className="body-text-3 text-main-2 mb-4">
                Browse products, add items to your cart (saved locally), try a
                fake checkout, and keep a wishlist — no backend required.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="tf-btn">
                  <span className="text-white">Shop products</span>
                </Link>
                <Link to="/contact" className="tf-btn btn-line">
                  <span className="body-md-2 fw-semibold">Contact us</span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="rounded-3 overflow-hidden shadow-sm">
                <img
                  src="/images/store/hero-electronics.jpg"
                  alt="Electronics workspace"
                  width={800}
                  height={600}
                  className="w-100 h-auto object-fit-cover"
                  style={{ maxHeight: 480, objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
