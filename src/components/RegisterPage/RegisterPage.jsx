import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  const history = useHistory();

  return (
    <div className='container'>
      <center>
        {/* <h2>{heading}</h2> */}
        <img className='login-logo' src='../images/firesmoke.png' alt='Welcome to Smokr' />
        {/* <img src={logoImage} alt="Welcome to Smokr" /> */}
      </center>
      <RegisterForm />

      <center className='smokr-member'>
          <h4>Already a Smokr Member?</h4>
        <button
          type='button'
          className='login-btn'
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default RegisterPage;
