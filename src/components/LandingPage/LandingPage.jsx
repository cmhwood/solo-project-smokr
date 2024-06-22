import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome to Smokr');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className='container'>
      <center>
        {/* <h2>{heading}</h2> */}
        <img
          className='login-logo'
          src='../images/firesmoke.png'
          alt='Welcome to Smokr'
        />
        {/* <img src={logoImage} alt="Welcome to Smokr" /> */}
      </center>

      {/* <div className='grid'> */}
      {/* <div className='grid-col grid-col_8'>
          <p></p>

          <p></p>

          <p></p>
<<<<<<< HEAD
        </div>
          <center>
        <div className='grid-col grid-col_4'>
          <RegisterForm />

            <h4>Already a Smokr Member?</h4>
            <button className='btn btn_sizeSm' onClick={onLogin}>
              Login
            </button>
        </div>
          </center>

        </div> */}
      <div>
        <RegisterForm />

        <center>
          <h4>Already a Smokr Member?</h4>
          <button className='btn btn_sizeSm' onClick={onLogin}>
            Login
          </button>
        </center>

      </div>
      {/* </div> */}
    </div>
  );
}

export default LandingPage;
