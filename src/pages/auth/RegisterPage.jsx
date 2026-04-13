import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const metadata = {
  title: "Register — GreatMate",
  description: "Create your GreatMate account.",
};

export default function RegisterPage() {
  const auth = useAuth();

  const handleRegister = () => {
    auth.signinRedirect({ extraQueryParams: { screen_hint: "signup" } });
  };

  const handleGoogleRegister = () => {
    auth.signinRedirect({ extraQueryParams: { identity_provider: "Google" } });
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-3">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="modal-log-wrap list-file-delete border rounded-3 p-4 p-lg-5 bg-white shadow-sm">
            <h5 className="title fw-semibold mb-4">Sign up</h5>
            <div className="form-content d-flex flex-column gap-3">
              <button
                onClick={handleRegister}
                className="tf-btn w-100 text-white"
              >
                Continue with Email
              </button>
              <button
                onClick={handleGoogleRegister}
                className="tf-btn btn-line w-100"
              >
                <i className="icon icon-google me-2" />
                Continue with Google
              </button>
              <p className="body-text-3 text-center mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
