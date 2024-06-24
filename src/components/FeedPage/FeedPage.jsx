import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function FeedPage() {
  const dispatch = useDispatch();
  const feeds = useSelector((store) => store.feedReducer);
  const history = useHistory();
  const cookRatings = useSelector((store) => store.cookRatings);

  useEffect(() => {
    dispatch({ type: 'FETCH_COOKS' });
  }, [dispatch]);

  const handleCookClick = (cookId) => {
    history.push(`/cook/${cookId}`);
  };

  return (
    <div>
       {/*(add to div?) className='container' */}
      <h2>All Cooks</h2>
      <div>
        {feeds?.map((cook) => (
          <div key={cook.id} className='cook'>
            <img src={cook.profile_image_url} alt='Profile' style={{ maxWidth: '32px' }} />
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
            <p>
              <strong>Cook Rating:</strong> {cook.cook_rating}
              {/* Rating:
              {cookRatings?.map((rating, i) => (
                <li key={i}>{rating.cook_rating}</li>
              ))} */}
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
            */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
