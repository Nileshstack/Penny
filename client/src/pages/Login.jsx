import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Typography, Card } from 'antd';
import api from '../services/api';
import Spinner from '../components/Layout/Spinner';
import '../styles/Login.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 12,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15
    }
  })
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await api.post('/v1/users/login', values);
      setLoading(false);
      toast.success('Login Successfully');
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      setLoading(false);
      toast.warn('Wrong Credentials');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      {loading && <Spinner />}
      <motion.div
        className="login-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="login-card" variant="borderless">
            <motion.div variants={itemVariants} custom={0}>
              <Title level={2} className="login-title">Welcome Back</Title>
              <Text type="secondary">Login to your account to continue</Text>
            </motion.div>

            <Form layout="vertical" onFinish={submitHandler} className="login-form">
              <motion.div variants={itemVariants} custom={1}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please enter your email' }]}
                >
                  <Input type="email" placeholder="Enter your email" />
                </Form.Item>
              </motion.div>

              <motion.div variants={itemVariants} custom={2}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>
              </motion.div>

              <motion.div variants={itemVariants} custom={3}>
                <motion.button
                  className="btn btn-primary login-button"
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} custom={4}>
                <Text type="secondary" className="register-link">
                  Not a user? <Link to="/register">Register here</Link>
                </Text>
              </motion.div>
            </Form>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Login;
