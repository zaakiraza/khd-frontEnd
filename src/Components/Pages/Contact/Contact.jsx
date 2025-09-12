import "./Contact.css";

function Contact() {
  return (
    <div className="contact" id="contact">
      <h1>Contact Us</h1>
      <hr />
      <div className="content">
        <div className="contact-info">
          <p>
            Asad Ali:{" "}
            <a href="tel:+923002504457">
              <strong> +92-300-2504457</strong>
            </a>
          </p>
          <p>
            Zeeshan Haider:{" "}
            <a href="tel:+923222116921">
              <strong>+92-322-2116921</strong>
            </a>
          </p>
          <div className="logos">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-brands fa-youtube"></i>
          </div>
        </div>
        <div className="image">
          <img src="/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Contact;
