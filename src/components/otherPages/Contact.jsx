import React from "react";
import { sendContactMessage } from "@/api";
import { formatApiError } from "@/api/errors";

export default function Contact() {
  const [form, setForm] = React.useState({
    name: "",
    subject: "",
    message: "",
    email: "",
  });
  const [status, setStatus] = React.useState({ type: "", message: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setSubmitting(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        email: form.email.trim() || undefined,
      });
      setStatus({
        type: "success",
        message: "Message sent successfully. Our team will contact you soon.",
      });
      setForm({ name: "", subject: "", message: "", email: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: formatApiError(
          err,
          "Could not send your message now. Please try again later."
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="row align-items-center g-4 mb-4 mb-xl-5">
          <div className="col-lg-6">
            <img
              src="/images/store/contact-hero.jpg"
              alt="Our team is here to help"
              width={720}
              height={480}
              className="w-100 rounded-3 shadow-sm"
              style={{ maxHeight: 420, objectFit: "cover" }}
            />
          </div>
          <div className="col-lg-6">
            <h2 className="h4 fw-bold mb-3">We&apos;re here to help</h2>
            <p className="body-text-3 text-main-2 mb-0">
              Questions about products, demo checkout, or your wishlist? Send us
              a message — this form is for display; connect your own backend
              when you&apos;re ready.
            </p>
          </div>
        </div>
        <div className="wg-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11678.740279919208!2d-75.53672684990242!3d39.167930537914174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c77b533177974f%3A0xd017ee22f8759803!2sWesley%20College%20%2F%20DSU!5e0!3m2!1sen!2s!4v1741056536407!5m2!1sen!2s"
            height={585}
            style={{ borderRadius: 8, width: "100%" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="bottom">
            <div className="contact-wrap">
              <div className="box-title">
                <h5 className="fw-semibold">Get A Quote</h5>
                <p className="body-text-3">
                  Fill up the form and our Team will get back to you within 24
                  hours.
                </p>
              </div>
              <form onSubmit={onSubmit} className="form-contact def">
                <fieldset>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                  />
                </fieldset>
                <fieldset>
                  <label>Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                  />
                </fieldset>
                <fieldset>
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    required
                  />
                </fieldset>
                <fieldset className="d-flex flex-column">
                  <label>Your message</label>
                  <textarea
                    style={{ height: 170 }}
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    required
                  />
                </fieldset>
                {status.message && (
                  <p
                    className={`small mb-0 ${
                      status.type === "success" ? "text-success" : "text-danger"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
                <div className="box-btn-submit">
                  <button
                    type="submit"
                    className="tf-btn text-white w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
            <div className="contact-info">
              <h5 className="fw-semibold">Contact Infomation</h5>
              <ul className="info-list">
                <li>
                  <span className="icon">
                    <i className="icon-location" />
                  </span>
                  <a
                    href="https://www.google.com/maps?q=8500%20Lorem%20StreetChicago"
                    className="link"
                    target="_blank"
                  >
                    8500 Lorem Street Chicago, <br />
                    IL 55030 Dolor sit amet
                  </a>
                </li>
                <li>
                  <span className="icon">
                    <i className="icon-phone" />
                  </span>
                  <a
                    href="tel:1234567"
                    className="product-title fw-semibold link"
                  >
                    <span>+8(800) 123 4567</span>
                  </a>
                </li>
                <li>
                  <span className="icon">
                    <i className="icon-direction" />
                  </span>
                  <a href="mailto:onsus@support.com" className="link">
                    <span>onsus@support.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
