import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function CookDetails() {
  const user = useSelector((store) => store.user);
  console.log('who am i', user);
  const { cookId } = useParams(); // Get cookId from URL params
  const dispatch = useDispatch();
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    cook_name: '',
    cook_date: '',
    location: '',
    recipe_notes: '',
    cook_rating: 0,
    is_active: true,
    cook_image_urls: [],
  });

  useEffect(() => {
    fetchCookDetails();
  }, []); // Fetch cook details on component mount

  const fetchCookDetails = async () => {
    try {
      const response = await axios.get(`/api/cooks/${cookId}`);
      console.log('COOK DATA', response.data);
      const {
        user_id,
        cook_name,
        cook_date,
        location,
        recipe_notes,
        cook_rating,
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
        is_active,
        cook_image_urls: cook_images || [],
      });
    } catch (error) {
      console.error('Error fetching cook details:', error);
    }
  };

  const handleUpdateCook = async () => {
    console.log('form data', formData);
    await axios.put(`/api/cooks/${cookId}`, formData);
    setEditMode(false);
  };

  const handleDeleteCook = async () => {
    const softDelete = { ...formData };
    softDelete.is_active = false;
    await axios.put(`/api/cooks/${cookId}`, softDelete);
    history.push('/cooks');
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
          {/* Input fields for editing */}
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
          <textarea
            name='recipe_notes'
            value={formData.recipe_notes}
            onChange={handleFormDataChange}
          ></textarea>
          <input
            type='number'
            name='cook_rating'
            value={formData.cook_rating}
            onChange={handleFormDataChange}
          />
          {/* Save and Cancel buttons */}
          <button onClick={handleUpdateCook}>Save</button>
          <button onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <div className='view-details'>
          {/* Display cook details */}
          <h2>{formData.cook_name}</h2>
          <p>Cook Date: {formData.cook_date}</p>
          <p>Location: {formData.location}</p>
          <p>Recipe Notes: {formData.recipe_notes}</p>
          <p>Cook Rating: {formData.cook_rating}</p>
          {/* Display cook images */}
          {formData.cook_image_urls.map((url, index) => (
            <img key={index} src={url} alt={`Cook Image ${index}`} style={{ maxWidth: '100px' }} />
          ))}
          {/* Edit and Delete buttons */}
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
