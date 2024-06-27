import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import './CookLikesPage.css'; /
import { useHistory } from 'react-router-dom';

function CookLikesPage() {
  const dispatch = useDispatch();
  const likedCooks = useSelector((store) => store.feedReducer); // Assuming you have a reducer for liked cooks
  const history = useHistory();

  useEffect(() => {
    dispatch({ type: 'FETCH_LIKED_COOKS' }); // Dispatch action to fetch liked cooks
  }, [dispatch]);

  const handleCookClick = (cookId) => {
    history.push(`/cook/${cookId}`);
  };

  return (
    <div className='container'>
      <h2 className='my-4'>Liked Cooks</h2>
      <div className='row'>
        {likedCooks.map((cook) => (
          <div key={cook.id} className='col-12 col-md-6 col-lg-4 mb-4'>
            <div className='card'>
              <img src={cook.profile_image_url} className='card-img-top' alt='Cook Profile' />
              <div className='card-body'>
                <h5 className='card-title'>{cook.cook_name}</h5>
                <p className='card-text'>{cook.location}</p>
                <button className='btn btn-primary' onClick={() => handleCookClick(cook.id)}>
                  View Cook
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CookLikesPage;
