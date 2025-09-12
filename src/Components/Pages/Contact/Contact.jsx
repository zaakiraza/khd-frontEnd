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
            <a
              href="https://www.facebook.com/khuddamonline?mibextid=ZbWKwL"
              target="_blank"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a>
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="https://www.youtube.com/@khuddamlearningonline"
              target="_blank"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
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
