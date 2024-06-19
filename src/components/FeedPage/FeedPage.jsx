import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function FeedPage() {
  const dispatch = useDispatch();
  const feeds = useSelector((store) => store.feedReducer);

  useEffect(() => {
    dispatch({ type: 'FETCH_COOKS' });
  }, [dispatch]);

  return (
    <div className='container'>
      <h2>All Cooks</h2>
      <div>
        {feeds?.map((cook) => (
          <div key={cook.id} className='cook'>
            <img src={cook.profile_image_url} alt='Profile' style={{ maxWidth: '100px' }} />
            <p>
              <strong>Cook Name:</strong> {cook.cook_name}
            </p>
            <p>
              <strong>Cook Date:</strong> {cook.cook_date}
            </p>
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
            <p>
              <strong>Recipe Notes:</strong> {cook.recipe_notes}
            </p>
            <p>
              <strong>Cook Rating:</strong> {cook.cook_rating}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
