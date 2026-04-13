import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const metadata = {
  title: "Login — GreatMate",
  description: "Sign in to your GreatMate account.",
};

export default function LoginPage() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleGoogleLogin = () => {
    auth.signinRedirect({ extraQueryParams: { identity_provider: "Google" } });
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-3">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="modal-log-wrap list-file-delete border rounded-3 p-4 p-lg-5 bg-white shadow-sm">
            <h5 className="title fw-semibold mb-4">Log in</h5>
            <div className="form-content d-flex flex-column gap-3">
              <button
                onClick={handleLogin}
                className="tf-btn w-100 text-white"
              >
                Continue with Email
              </button>
              <button
                onClick={handleGoogleLogin}
                className="tf-btn btn-line w-100"
              >
                <i className="icon icon-google me-2" />
                Continue with Google
              </button>
              <p className="body-text-3 text-center mb-0">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-primary">
                  Register
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
