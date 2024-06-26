import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './CooksPage.css';

const CooksPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const cooks = useSelector((state) => state.cooksReducer);
  const cookRatings = useSelector((store) => store.cookRatings);

  useEffect(() => {
    dispatch({ type: 'FETCH_COOKS' });
    window.scrollTo(0, 0);
  }, [dispatch]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const handleCookClick = (cookId) => {
    history.push(`/cook/${cookId}`);
  };

  const handleCreateNewCook = () => {
    history.push('/cooks/new');
  };

  return (
    <div className='container-fluid px-0'>
      <h2 className='my-4'>My Smokr</h2>
      <div className='row mx-0'>
        {cooks.length === 0 ? (
          <div className='text-center'>
            <h2>What's on your Smokr?</h2>
            <button className='new-btn-primary' onClick={handleCreateNewCook}>
              Create a New Cook
            </button>
          </div>
        ) : (
          cooks.map((cook) => (
            <div key={cook.id} className='col-12 px-0'>
              <div className='card p-3 cook-card'>
                <div className='d-flex align-items-center'>
                  <img
                    src={cook.profile_image_url}
                    alt='Profile'
                    className='profile-image rounded-circle mr-3'
                  />
                  <div>
                    <p className='mb-1'>
                      <span className='cook-name' onClick={() => handleCookClick(cook.id)}>
                        {cook.cook_name}
                      </span>
                    </p>
                    <p className='mb-1'>{cook.location}</p>
                  </div>
                </div>
                <div className='cook-images' onClick={() => handleCookClick(cook.id)}>
                  {cook.cook_images?.slice(0, 2).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Cook Image ${index}`}
                      className={`cook-image ${
                        index === 0 ? 'cook-image-large' : 'cook-image-large'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CooksPage;
