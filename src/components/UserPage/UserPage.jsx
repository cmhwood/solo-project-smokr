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
      {/* <p>Your ID is: {user.id}</p> */}
      <div className='profile'>
        <center>
          <img
            className='profile-pic'
            src={newProfileImageUrl.profile_image_url}
            alt='Profile'
            width='150'
            height='150'
          />
        </center>
        <center>
          <div>
            <h2>Profile Image Upload</h2>
            {useScript('https://widget.cloudinary.com/v2.0/global/all.js')}
            <button className='pick-btn' type='button' onClick={openWidget}>
              Select Profile Image
            </button>
          </div>
        </center>
        {/* <br /> */}
        {/* <div>
          <input
            type='text'
            placeholder='Enter new profile image URL'
            value={newProfileImageUrl}
            onChange={(e) => setNewProfileImageUrl(e.target.value)}
          />
          </div> */}
        <center>
          <button className='profile-btn' onClick={handleProfileImageUpdate}>
            Save
          </button>
        </center>
      </div>
      <center>
        <br />
        <LogOutButton className='log-out-btn' />
      </center>
    </div>
  );
}

export default UserPage;
