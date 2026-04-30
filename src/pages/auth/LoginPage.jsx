import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { useUserAuth } from "@/context/UserAuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const metadata = {
  title: "Login — GreatMate",
  description: "Sign in to your GreatMate account.",
};

function toAuthUiError(err, fallback) {
  const message = err?.message || "";
  if (
    message.includes("UserPool not configured") ||
    message.includes("Auth UserPool not configured")
  ) {
    return "Cognito is not configured in this environment. Add VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_USER_POOL_CLIENT_ID, and VITE_COGNITO_HOSTED_UI_DOMAIN to your .env file, then restart npm run dev.";
  }
  return message || fallback;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithEmailPassword, signInWithGoogle, isAuthenticated } =
    useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(nextPath, { replace: true });
    }
  }, [isAuthenticated, navigate, nextPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await signInWithEmailPassword(
        email.trim(),
        password
      );
      if (result.ok) {
        navigate(nextPath, { replace: true });
      } else {
        setError(result.message || "Sign-in could not complete.");
      }
    } catch (err) {
      setError(
        toAuthUiError(
          err,
          "Sign-in failed. Check your email and password, or use Hosted UI / Google."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(toAuthUiError(err, "Could not start Google sign-in."));
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-3">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="modal-log-wrap list-file-delete border rounded-3 p-4 p-lg-5 bg-white shadow-sm">
            <h5 className="title fw-semibold mb-2">Log in</h5>
            <p className="small text-secondary mb-4">
              Email/password signs in through AWS Cognito (check the Network
              tab for <code>cognito-idp</code> requests). Use the same user
              your API authorizer expects.
            </p>
            {searchParams.get("session") === "expired" && (
              <p className="small text-warning mb-3">
                Your session expired. Please sign in again.
              </p>
            )}
            {error && (
              <div className="alert alert-danger small py-2 mb-3" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="form-content d-flex flex-column gap-3">
              <fieldset className="mb-0">
                <label className="fw-semibold body-md-2 d-block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </fieldset>
              <fieldset className="mb-0">
                <label className="fw-semibold body-md-2 d-block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </fieldset>
              <button
                type="submit"
                className="tf-btn w-100 text-white"
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={handleGoogle}
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
            </form>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
