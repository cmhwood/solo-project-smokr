import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';

function LoginPage() {
  const history = useHistory();

  return (
    <div className='container'>
      <center>
        {/* <h2>{heading}</h2> */}
        <img className='login-logo' src='../images/firesmoke.png' alt='Welcome to Smokr' />
        {/* <img src={logoImage} alt="Welcome to Smokr" /> */}
      </center>
      <LoginForm />

      <center className='smokr-member'>
          <h4>Member Registration</h4>
        <button
          type='button'
          className='register-btn'
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </button>
      </center>
    </div>
  );
}

export default LoginPage;
