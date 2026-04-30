import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import MetaComponent from "@/components/common/MetaComponent";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  confirmSignUp,
  signIn as amplifySignIn,
  signUp,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const metadata = {
  title: "Register — GreatMate",
  description: "Create your GreatMate account.",
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, signInWithGoogle } = useUserAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      const out = await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: fullName.trim(),
          },
        },
      });
      const step = out.nextStep?.signUpStep;
      if (step === "CONFIRM_SIGN_UP") {
        setNeedsConfirm(true);
        setInfo("Check your email for a confirmation code.");
      } else if (step === "COMPLETE_AUTO_SIGN_IN") {
        setInfo("Account created. Finishing sign-in…");
        await amplifySignIn({ username: email.trim(), password });
        navigate("/", { replace: true });
      } else {
        setInfo("Sign up submitted. You can try signing in.");
      }
    } catch (err) {
      setError(toAuthUiError(err, "Sign up failed."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await confirmSignUp({
        username: email.trim(),
        confirmationCode: code.trim(),
      });
      await amplifySignIn({ username: email.trim(), password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(toAuthUiError(err, "Confirmation failed."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(toAuthUiError(err, "Could not start Google sign-up."));
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header4 />
      <section className="tf-sp-3">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="modal-log-wrap list-file-delete border rounded-3 p-4 p-lg-5 bg-white shadow-sm">
            <h5 className="title fw-semibold mb-2">Sign up</h5>
            <p className="small text-secondary mb-4">
              Creates a user in your Cognito pool via Amplify (visible in
              Network as Cognito API calls).
            </p>
            {info && (
              <div className="alert alert-info small py-2 mb-3" role="status">
                {info}
              </div>
            )}
            {error && (
              <div className="alert alert-danger small py-2 mb-3" role="alert">
                {error}
              </div>
            )}
            {!needsConfirm ? (
              <form
                onSubmit={handleSignUp}
                className="form-content d-flex flex-column gap-3"
              >
                <fieldset className="mb-0">
                  <label className="fw-semibold body-md-2 d-block mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </fieldset>
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
                  />
                </fieldset>
                <fieldset className="mb-0">
                  <label className="fw-semibold body-md-2 d-block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  type="submit"
                  className="tf-btn w-100 text-white"
                  disabled={submitting}
                >
                  {submitting ? "Please wait…" : "Create account"}
                </button>
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="tf-btn btn-line w-100"
                >
                  <i className="icon icon-google me-2" />
                  Continue with Google
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleConfirm}
                className="form-content d-flex flex-column gap-3"
              >
                <fieldset className="mb-0">
                  <label className="fw-semibold body-md-2 d-block mb-1">
                    Verification code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code from email"
                  />
                </fieldset>
                <button
                  type="submit"
                  className="tf-btn w-100 text-white"
                  disabled={submitting}
                >
                  {submitting ? "Verifying…" : "Confirm and sign in"}
                </button>
              </form>
            )}
            <p className="body-text-3 text-center mb-0 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
