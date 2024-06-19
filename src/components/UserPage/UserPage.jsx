import React, { useState } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [profileImageUrl, setProfileImageUrl] = useState(
    user.profile_image_url || 'path/to/generic/profile/image.png'
  );
  const [newProfileImageUrl, setNewProfileImageUrl] = useState('');

  const handleProfileImageUpdate = () => {
    axios
      .put('/api/user/profile-image', { profile_image_url: newProfileImageUrl })
      .then((response) => {
        dispatch({ type: 'SET_USER', payload: { ...user, profile_image_url: newProfileImageUrl } });
        setProfileImageUrl(newProfileImageUrl);
        setNewProfileImageUrl('');
      })
      .catch((error) => {
        console.error('Error updating profile image:', error);
      });
  };

  return (
    <div className='container'>
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <div>
        <img
          src={
            profileImageUrl ||
            'https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg'
          } // Use the same generic image URL here
          alt='Profile'
          width='100'
          height='100'
        />
        <div>
          <input
            type='text'
            placeholder='Enter new profile image URL'
            value={newProfileImageUrl}
            onChange={(e) => setNewProfileImageUrl(e.target.value)}
          />
          <button onClick={handleProfileImageUpdate}>Update Profile Image</button>
        </div>
      </div>
      <LogOutButton className='btn' />
    </div>
  );
}

export default UserPage;
