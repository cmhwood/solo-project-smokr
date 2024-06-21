import React, { useState } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useScript } from '../../hooks/useScript';

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [newProfileImageUrl, setNewProfileImageUrl] = useState({
    profile_image_url: user.profile_image_url || '',
  });

  const openWidget = () => {
    !!window.cloudinary &&
      window.cloudinary
        .createUploadWidget(
          {
            sources: ['local', 'url', 'camera'],
            // cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
            cloudName: 'ddlkh3gov',
            // uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
            uploadPreset: 'qaikv0iz',
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              // When an upload is successful, save the uploaded URL to local state!
              setNewProfileImageUrl({
                ...newProfileImageUrl,
                profile_image_url: result.info.secure_url,
              });
            }
          }
        )
        .open();
  };

  const handleProfileImageUpdate = (event) => {
    event.preventDefault();

    console.log('new profile image url', newProfileImageUrl.profile_image_url);
    axios
      .put('/api/user/profile-image', newProfileImageUrl)
      .then((response) => {
        dispatch({ type: 'FETCH_USER' });
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
        <img src={newProfileImageUrl.profile_image_url} alt='Profile' width='100' height='100' />

        <div>
          <h2>Profile Image Upload</h2>
          {useScript('https://widget.cloudinary.com/v2.0/global/all.js')}
          <button type='button' onClick={openWidget}>
            Pick File
          </button>
        </div>
        <br />
        {/* <div>
          <input
            type='text'
            placeholder='Enter new profile image URL'
            value={newProfileImageUrl}
            onChange={(e) => setNewProfileImageUrl(e.target.value)}
          />
          </div> */}
        <button onClick={handleProfileImageUpdate}>Update Profile Image</button>
      </div>
      <br />
      <LogOutButton className='btn' />
    </div>
  );
}

export default UserPage;
