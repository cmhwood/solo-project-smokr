import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function CookDetailPage() {
  const { cookId } = useParams();
  const dispatch = useDispatch();
  const cook = useSelector((state) => state.cookDetailReducer);

  useEffect(() => {
    dispatch({ type: 'FETCH_COOK_DETAIL', payload: cookId });
  }, [dispatch, cookId]);

  if (!cook) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <h2>Cook Details</h2>
      <div className='cook-detail'>
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
            <img key={index} src={url} alt={`Cook Image ${index}`} style={{ maxWidth: '100px' }} />
          ))}
        </div>
        <p>
          <strong>Recipe Notes:</strong> {cook.recipe_notes}
        </p>
        <p>
          <strong>Cook Rating:</strong> {cook.cook_rating}
        </p>
      </div>
    </div>
  );
}

export default CookDetailPage;
