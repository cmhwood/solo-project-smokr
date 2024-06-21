import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './CookDetailPage.css';
import { useScript } from '../../hooks/useScript';

function CookDetails() {
  const user = useSelector((store) => store.user);
  const { cookId } = useParams(); // Get cookId from URL params
  const dispatch = useDispatch();
  const history = useHistory();
  const [imageURLs, setImageURLs] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    cook_name: '',
    cook_date: '',
    location: '',
    recipe_notes: '',
    cook_rating: 0,
    cook_rating_text: '',
    is_active: true,
    cook_image_urls: [],
  });

  // Load the Cloudinary script unconditionally
  useScript('https://widget.cloudinary.com/v2.0/global/all.js');

  useEffect(() => {
    fetchCookDetails();
  }, []); // Fetch cook details on component mount

  useEffect(() => {
    if (editMode) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        cook_image_urls: imageURLs,
      }));
    }
  }, [imageURLs, editMode]);

  const fetchCookDetails = async () => {
    try {
      const response = await axios.get(`/api/cooks/${cookId}`);
      const {
        user_id,
        cook_name,
        cook_date,
        location,
        recipe_notes,
        cook_rating,
        cook_rating_text,
        is_active,
        cook_images,
      } = response.data;
      setFormData({
        user_id,
        cook_name,
        cook_date,
        location,
        recipe_notes,
        cook_rating,
        cook_rating_text,
        is_active,
        cook_image_urls: cook_images || [],
      });
    } catch (error) {
      console.error('Error fetching cook details:', error);
    }
  };

  const openWidget = () => {
    if (window.cloudinary) {
      window.cloudinary
        .createUploadWidget(
          {
            sources: ['local', 'url', 'camera'],
            cloudName: 'ddlkh3gov',
            uploadPreset: 'qaikv0iz',
            multiple: 'true',
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              setImageURLs((prevImageURLs) => [...prevImageURLs, result.info.secure_url]);
            }
          }
        )
        .open();
    }
  };

  const handleUpdateCook = async () => {
    try {
      const updatedFormData = {
        ...formData,
        cook_image_urls: imageURLs,
      };
      await axios.put(`/api/cooks/${cookId}`, updatedFormData);
      fetchCookDetails();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating cook:', error);
    }
  };

  const handleDeleteCook = async () => {
    try {
      const softDelete = { ...formData, is_active: false };
      await axios.put(`/api/cooks/${cookId}`, softDelete);
      history.push('/cooks');
    } catch (error) {
      console.error('Error deleting cook:', error);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleFormDataChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='cook-details'>
      {editMode ? (
        <div className='edit-form'>
          <input
            type='text'
            name='cook_name'
            value={formData.cook_name}
            onChange={handleFormDataChange}
          />
          <input
            type='date'
            name='cook_date'
            value={formData.cook_date}
            onChange={handleFormDataChange}
          />
          <input
            type='text'
            name='location'
            value={formData.location}
            onChange={handleFormDataChange}
          />
          <select name='cook_rating' value={formData.cook_rating} onChange={handleFormDataChange}>
            <option value='1'>🔥</option>
            <option value='2'>🔥🔥</option>
            <option value='3'>🔥🔥🔥</option>
            <option value='4'>🔥🔥🔥🔥</option>
            <option value='5'>🔥🔥🔥🔥🔥</option>
          </select>
          <textarea
            name='recipe_notes'
            value={formData.recipe_notes}
            onChange={handleFormDataChange}
          ></textarea>
          <div>
            {/* <h2>Image Upload</h2> */}
            <button type='button' onClick={openWidget}>
              Upload Images
            </button>
          </div>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {imageURLs.map((url, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleUpdateCook}>Save</button>
          <button onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <div className='view-details'>
          <span>{formData.cook_name}</span>
          <p>Cook Date: {formData.cook_date}</p>
          <p>Location: {formData.location}</p>
          <p>Recipe Notes: {formData.recipe_notes}</p>
          <p>Cook Rating: {formData.cook_rating_text}</p>
          <div>
            {formData.cook_image_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Cook Image ${index}`}
                style={{ maxWidth: '100px' }}
              />
            ))}
          </div>
          {user.id === formData.user_id && (
            <>
              <button onClick={handleEditToggle}>Edit</button>
              <button onClick={handleDeleteCook}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CookDetails;
