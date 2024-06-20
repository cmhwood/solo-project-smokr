import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AddCookForm = () => {
  const [cookName, setCookName] = useState('');
  const [cookDate, setCookDate] = useState('');
  const [location, setLocation] = useState('');
  const [recipeNotes, setRecipeNotes] = useState('');
  const [cookRating, setCookRating] = useState('');
  const [imageURLs, setImageURLs] = useState(['']);
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

  const handleImageChange = (index, value) => {
    const newImageURLs = [...imageURLs];
    newImageURLs[index] = value;
    setImageURLs(newImageURLs);
  };

  const addImageField = () => {
    setImageURLs([...imageURLs, '']);
  };

  const removeImageField = (index) => {
    const newImageURLs = imageURLs.filter((_, i) => i !== index);
    setImageURLs(newImageURLs);
  };

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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Cook Name:</label>
        <input
          type='text'
          value={cookName}
          onChange={(e) => setCookName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Cook Date:</label>
        <input
          type='date'
          value={cookDate}
          onChange={(e) => setCookDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Recipe or Notes:</label>
        <textarea value={recipeNotes} onChange={(e) => setRecipeNotes(e.target.value)} required />
      </div>
      <div>
        <label>Cook Rating:</label>
        <select value={cookRating} onChange={(e) => setCookRating(e.target.value)} required>
          <option value=''>Select Rating</option>
          {ratingOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.rating}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Image URLs:</label>
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
        </button>
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default AddCookForm;
