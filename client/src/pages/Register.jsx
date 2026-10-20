import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Form, Input } from 'antd';
import Spinner from '../components/Layout/Spinner';
import { toast } from 'react-toastify';
import '../styles/Register.css'; 

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await api.post('/v1/users/register', values);
      toast.success('Registered Successfully');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      toast.warn('Unable to register. Check your details or use another email address.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="register-background">
        {loading && <Spinner />}
        <div className="register-container">
          <Form layout="vertical" onFinish={submitHandler} className="register-form">
            <h2 className="form-title">Create an Account</h2>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                { max: 128, message: 'Password must be no more than 128 characters' },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <div className="register-footer">
              <p>
                Already Registered? <Link to="/login">Login</Link>
              </p>
            </div>
            <button type="submit" className="btn-submit">
              Register
            </button>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
