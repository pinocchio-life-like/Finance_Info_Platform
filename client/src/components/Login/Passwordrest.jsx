import React, { useState } from 'react';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [messageFromServer, setMessageFromServer] = useState('');
  const [showNullError, setShowNullError] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const sendEmail = async () => {
    try {
      if (email === '') {
        setShowError(false);
        setMessageFromServer('');
        setShowNullError(true);
        return;
      }

      const response = await api.post(
        '/api/forgot',
        { email }
      );

      if (response.data === 'recovery email sent') {
        setShowError(false);
        setMessageFromServer('recovery email sent');
        setShowNullError(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response.data === 'email not in db') {
        setShowError(true);
        setMessageFromServer('');
        setShowNullError(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendEmail();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email Address"
          required
        />
        <button type="submit">Send Password Reset Email</button>
      </form>
      {showNullError && <p>The email address cannot be null.</p>}
      {showError && (
        <div>
          <p>
            That email address isn't recognized. Please try again or
            register for a new account.
          </p>
          <button onClick={() => window.location.href='/register'}>Register</button>
        </div>
      )}
      {messageFromServer === 'recovery email sent' && (
        <div>
          <h3>Password Reset Email Successfully Sent!</h3>
        </div>
      )}
      <button onClick={() => window.location.href='/'}>Go Home</button>
    </div>
  );
};

export default ForgotPassword;