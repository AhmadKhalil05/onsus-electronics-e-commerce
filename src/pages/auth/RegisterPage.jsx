import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { Link } from "react-router-dom";
import React from "react";

const metadata = {
  title: "Register — Onsus Electronics",
  description: "Create an account (demo — no real registration).",
};

export default function RegisterPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-3">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="modal-log-wrap list-file-delete border rounded-3 p-4 p-lg-5 bg-white shadow-sm">
            <h5 className="title fw-semibold mb-4">Sign up</h5>
            <form
              action="#"
              className="form-log"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-content">
                <fieldset className="mb-3">
                  <label className="fw-semibold body-md-2 d-block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-100"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </fieldset>
                <fieldset className="mb-3">
                  <label className="fw-semibold body-md-2 d-block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    className="w-100"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </fieldset>
                <p className="body-text-3 text-main-2 mb-3">
                  Demo only — data is not stored on any server.
                </p>
              </div>
              <button type="submit" className="tf-btn w-100 text-white mb-3">
                Sign up
              </button>
              <p className="body-text-3 text-center mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
