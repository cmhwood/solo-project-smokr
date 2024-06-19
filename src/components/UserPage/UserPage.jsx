import React, { useState } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useScript } from '../../hooks/useScript';

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  // const [profileImageUrl, setProfileImageUrl] = useState(
  //   user.profile_image_url || 'path/to/generic/profile/image.png'
  // );
  const [newProfileImageUrl, setNewProfileImageUrl] = useState({
    profile_image_url: '',
  });

  const openWidget = () => {
    // Currently there is a bug with the Cloudinary <Widget /> component
    // where the button defaults to a non type="button" which causes the form
    // to submit when clicked. So for now just using the standard widget that
    // is available on window.cloudinary
    // See docs: https://cloudinary.com/documentation/upload_widget#look_and_feel_customization
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

  const handleProfileImageUpdate = () => {
    axios
      .put('/api/user/profile-image', { profile_image_url: newProfileImageUrl })
      .then((response) => {
        dispatch({ type: 'SET_USER', payload: newProfileImageUrl });
        setNewProfileImageUrl(newProfileImageUrl);
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
            newProfileImageUrl ||
            'https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg'
          } // Use the same generic image URL here
          alt='Profile'
          width='100'
          height='100'
        />

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
