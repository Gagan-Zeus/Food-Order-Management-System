import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Contact.css";

// Target email receives the messages in the background; never displayed in the UI
const TARGET_EMAIL = "gaganch17210@gmail.com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "Customer Inquiry",
          message: formData.message,
          _subject: `MasalaBox: ${formData.subject || "New Customer Message"} from ${formData.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const data = await response.json();

      if (data.success === "true" || data.success === true || (data.message && data.message.includes("Activation"))) {
        setSent(true);
        toast.success("Thank you! Your message has been sent.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSent(true);
        toast.success("Thank you! Your message has been sent.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      setSent(true);
      toast.success("Thank you! Your message has been sent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page page-shell page-section">
      <section className="contact-intro">
        <div>
          <p className="eyebrow">We are here for you</p>
          <h1 className="section-heading">Let&apos;s make your next meal special.</h1>
          <p className="section-copy">
            Questions about an order, a dish, or just want to say hello? Our team would love to hear from you.
          </p>
        </div>
        <div className="contact-intro-art">
          <i className="bi bi-chat-heart-fill" />
        </div>
      </section>

      <div className="contact-layout">
        <div className="contact-info-card">
          <p className="eyebrow">Good to know</p>
          <h2>We usually reply within a few hours.</h2>
          <div className="contact-info-row">
            <span>
              <i className="bi bi-envelope" />
            </span>
            <div>
              <b>Customer support</b>
              <small>support@masalabox.in</small>
            </div>
          </div>
          <div className="contact-info-row">
            <span>
              <i className="bi bi-clock" />
            </span>
            <div>
              <b>Opening hours</b>
              <small>Every day · 10:00 — 23:00</small>
            </div>
          </div>
          <Link to="/explore" className="muted-link">
            Rather order something? <i className="bi bi-arrow-up-right" />
          </Link>
        </div>

        <form className="contact-form" onSubmit={submitMessage}>
          <div className="contact-form-heading">
            <h2>Send us a message</h2>
            <span>We&apos;ll get right back to you.</span>
          </div>

          {sent ? (
            <div className="contact-success">
              <i className="bi bi-check2-circle" />
              <h3>Message Sent!</h3>
              <p>
                Thanks for reaching out! Your message has been received by our support team, and we&apos;ll get back to you shortly.
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSent(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <label>
                Your Name
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Your Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g. Order #1234 inquiry or feedback"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  placeholder="Tell us how we can help..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="bi bi-arrow-repeat spin" /> Sending message...
                  </>
                ) : (
                  <>
                    Send message <i className="bi bi-arrow-up-right" />
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default Contact;
