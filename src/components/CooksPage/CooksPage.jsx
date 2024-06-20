import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const CooksPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const cooks = useSelector((state) => state.cooksReducer);

  useEffect(() => {
    dispatch({ type: 'FETCH_COOKS' }); // Fetch cooks when component mounts
  }, [dispatch]);

  const handleCookClick = (cookId) => {
    history.push(`/cook/${cookId}`); // Navigate to cook details page
  };

  return (
    <div className='container'>
      <h2>My Cooks</h2>
      <div>
        {cooks.map((cook) => (
          <div key={cook.id} className='cook'>
            {/* Not showing profile pic on cooks page */}
            {/* <img src={cook.profile_image_url} alt='Profile' style={{ maxWidth: '100px' }} /> */}
            <p>
              <strong>Cook Name: </strong>
              <span
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => handleCookClick(cook.id)}
              >
                {cook.cook_name}
              </span>
            </p>
            {/* <p>
              <strong>Cook Date:</strong> {cook.cook_date}
            </p> */}
            <p>
              <strong>Location:</strong> {cook.location}
            </p>
            <div>
              <strong>Cook Images:</strong>
              {cook.cook_images?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Cook Image ${index}`}
                  style={{ maxWidth: '100px' }}
                />
              ))}
            </div>
            {/* <p>
              <strong>Recipe Notes:</strong> {cook.recipe_notes}
            </p>
            <p>
              <strong>Cook Rating:</strong> {cook.cook_rating}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CooksPage;
