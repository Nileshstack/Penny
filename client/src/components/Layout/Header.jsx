import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import '../../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setLoginUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <>
      <motion.nav
        className="custom-navbar"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, duration: 0.6 }}
      >
        <div className="navbar-container">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link className="navbar-brand" to="/">PennyPilot</Link>
          </motion.div>

          <div className="navbar-links">
            {loginUser && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link className="navbar-user" to="/user">
                  {loginUser.name}
                </Link>
              </motion.div>
            )}
            <motion.button
              className="navbar-btn"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
                toast.info('Logout successfully');
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Header;
