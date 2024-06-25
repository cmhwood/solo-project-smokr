import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useScript } from '../../hooks/useScript';
import './AddCook.css';

const AddCookForm = () => {
  const [cookName, setCookName] = useState('');
  const [cookDate, setCookDate] = useState('');
  const [location, setLocation] = useState('');
  const [recipeNotes, setRecipeNotes] = useState('');
  const [cookRating, setCookRating] = useState('');
  const [imageURLs, setImageURLs] = useState([]);
  const [ratingOptions, setRatingOptions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch rating options from the database
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/ratings');
        setRatingOptions(response.data);
      } catch (error) {
        console.error('Error fetching ratings', error);
      }
    };

    fetchRatings();
  }, []);

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
            multiple: 'true',
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              // When an upload is successful, save the uploaded URL to local state!
              // setImageURLs([...imageURLs, result.info.secure_url]);
              setImageURLs((prevImageURLs) => [...prevImageURLs, result.info.secure_url]);
              // Holding on to the previously uploaded images in state with prevImageURLs
            }
          }
        )
        .open();
  };
  console.log('what are the images', imageURLs);

  // Fall back for adding images using the URL in the form field
  // const handleImageChange = (index, value) => {
  //   const newImageURLs = [...imageURLs];
  //   newImageURLs[index] = value;
  //   setImageURLs(newImageURLs);
  // };

  // const addImageField = () => {
  //   setImageURLs([...imageURLs, '']);
  // };

  // const removeImageField = (index) => {
  //   const newImageURLs = imageURLs.filter((_, i) => i !== index);
  //   setImageURLs(newImageURLs);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cookData = {
      cook_name: cookName,
      cook_date: cookDate,
      location: location,
      recipe_notes: recipeNotes,
      cook_rating: cookRating,
      cook_image_urls: imageURLs.filter((url) => url), // Ensure no empty URLs
    };

    try {
      const response = await axios.post('/api/cooks', cookData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    history.push('/cooks');
  };

  return (
    <div className='view-details'>
      <form onSubmit={handleSubmit}>
        <div>
          {/* <label>Cook Name:</label> */}
          <input
            type='text'
            value={cookName}
            placeholder='Add a cook name'
            onChange={(e) => setCookName(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <label>Cook Date:</label> */}
          <input
            type='date'
            value={cookDate}
            onChange={(e) => setCookDate(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <label>Location:</label> */}
          <input
            type='text'
            value={location}
            placeholder='Add your location'
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <label>Cook Rating:</label> */}
          <select value={cookRating} onChange={(e) => setCookRating(e.target.value)} required>
            <option value=''>Rate your finished product</option>
            {ratingOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.rating}
              </option>
            ))}
          </select>
        </div>
        <div>
          {/* <label>Recipe or Notes:</label> */}
          <textarea value={recipeNotes} placeholder='Add your recipe or notes' onChange={(e) => setRecipeNotes(e.target.value)} required />
        </div>
        <div>
          <div>
            {/* <h2>Profile Image Upload</h2> */}
            {useScript('https://widget.cloudinary.com/v2.0/global/all.js')}
            <button type='button' className='btn' onClick={openWidget}>
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
          <button type='submit' className='btn'>
            Submit
          </button>
          {/* Fall back for adding images using the URL in the form field */}
          {/* <label>Image URLs:</label>
        {imageURLs.map((url, index) => (
          <div key={index}>
            <input
              type='text'
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
            <button type='button' onClick={() => removeImageField(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' onClick={addImageField}>
          Add Another Image
        </button> */}
        </div>
      </form>
    </div>
  );
};

export default AddCookForm;
