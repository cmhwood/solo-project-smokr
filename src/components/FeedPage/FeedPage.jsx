import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './FeedPage.css';

function FeedPage() {
  const dispatch = useDispatch();
  const feeds = useSelector((store) => store.feedReducer);
  const history = useHistory();
  // const cookRatings = useSelector((store) => store.cookRatings);

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

  const handleLikeClick = (cookId) => {
    dispatch({ type: 'LIKE_COOK', payload: cookId });
    // dispatch({ type: 'FETCH_COOKS' });
  };

  return (
    <div className='container-fluid px-0'>
      <h2 className='my-4'>Smokr</h2>
      <div className='row mx-0'>
        {feeds?.map((cook) => (
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
                    {/* <strong>Cook Name: </strong> */}
                    <span className='cook-name' onClick={() => handleCookClick(cook.id)}>
                      {cook.cook_name}
                    </span>
                  </p>
                  <p className='mb-1'>
                    {/* <strong>Location:</strong>  */}
                    {cook.location}
                  </p>
                </div>
              </div>
              <div className='mt-3'>
                <p>
                  <strong>Rating:</strong> {cook.cook_rating}
                </p>
                <div>
                  <div className='cook-images' onClick={() => handleCookClick(cook.id)}>
                    {/* <strong className='text-white'>Cook Images:</strong> */}
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
                <div className='like-container'>
                  <div className='liked-users'>
                    {cook.likedUsers?.map((user, index) => (
                      <img
                        key={index}
                        src={user.profile_image_url}
                        alt='User Profile'
                        className='liked-user-profile rounded-circle'
                      />
                    ))}
                  </div>
                  <button className='like-button' onClick={() => handleLikeClick(cook.id)}>
                    {/* Likes */}
                    <img className='thumb-bubble' src='../images/thumbs-up-24.png' alt='Add' />
                    {/* {' '} */}
                    {/* {cook.like_count} */}
                  </button>
                  {/* <span className='like-count'>{cook.like_count}</span> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
