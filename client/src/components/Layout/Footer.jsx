import React from 'react';
import '../../styles/Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h5>PennyPilot</h5>
          <p>Track your income & expenses smartly with PennyPilot. Your personal finance companion.</p>
        </div>
        <div className="footer-section links">
          <h6>Quick Links</h6>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Add Transaction</a></li>
            <li><a href="#">Analytics</a></li>
            <li><a href="#">Profile</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h6>Connect</h6>
          <a href="https://github.com/Nileshstack"><i className="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/nilesh-srivastava-4b380a339?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><i className="fab fa-linkedin"></i></a>
          <a href="https://www.instagram.com/srivastava._.ji?igsh=b21oM3V1ZnNzZzUw"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 PennyPilot | Created by Nilesh Srivastava | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
