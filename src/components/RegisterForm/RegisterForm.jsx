import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (
    <div>
      <form className='formPanel' onSubmit={registerUser}>
        <h3>Member Registration</h3>
        {errors.registrationMessage && (
          <h3 className='alert' role='alert'>
            {errors.registrationMessage}
          </h3>
        )}
        <center>
          <label htmlFor='username'>
            Username:
            <input
              className='username'
              type='text'
              name='username'
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </center>
        <center>
          <label htmlFor='password'>
            Password:
            <input
              className='password'
              type='password'
              name='password'
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </center>
        <center>
          <button className='register-btn' type='submit' name='submit'>
            Register
          </button>
        </center>
      </form>
    </div>
  );
}

export default RegisterForm;
