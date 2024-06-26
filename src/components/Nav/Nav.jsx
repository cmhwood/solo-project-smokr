import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className='nav'>
      {/* <Link to='/home'>
        <h2 className='nav-title'>Smokr</h2>
      </Link> */}
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className='navLink' to='/login'>
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className='navLink' to='/user'>
              {user.profile_image_url ? (
                <img className='nav-profile-image' src={user.profile_image_url} alt='Profile' />
              ) : (
                <img className='nav-profile-icon' src='../images/user-24.png' alt='Profile icon' />
              )}
            </Link>
            {/* <Link className='navLink' to='/user'>
              <img className='speech-bubble' src='../images/user-24.png' alt='Comment bubble' />
              Profile
            </Link> */}

            <Link className='navLink' to='/feed'>
              <img className='speech-bubble' src='../images/home-24.png' alt='Comment bubble' />
              {/* Feed */}
            </Link>

            <Link className='navLink' to='/cooks'>
              <img className='speech-bubble' src='../images/weber-24.png' alt='Comment bubble' />
              {/* Cooks */}
            </Link>

            <Link className='navLink' to='/cooks/new'>
              <img className='speech-bubble' src='../images/add-24.png' alt='Comment bubble' />
              {/* Add Cook */}
            </Link>

            {/* <Link className='navLink' to='/info'>
              Info Page
            </Link> */}

            {/* <LogOutButton className='navLink' /> */}
          </>
        )}

        {/* <Link className='navLink' to='/about'>
          About
        </Link> */}
      </div>
    </div>
  );
}

export default Nav;
