import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import './CookLikesPage.css';

function CookLikesPage() {
  const dispatch = useDispatch();
  const { cookId } = useParams();
  const likedUsers = useSelector((store) => store.likesReducer);

  useEffect(() => {
    dispatch({ type: 'FETCH_LIKED_USERS', payload: cookId });
  }, [dispatch, cookId]);

  return (
    <div className="container-fluid px-0">
      <h2 className="my-4">Users who liked this cook</h2>
      <div className="row mx-0">
        {likedUsers?.map((user) => (
          <div key={user.user_id} className="col-12 px-0">
            <div className="card p-3 user-card">
              <div className="d-flex align-items-center">
                <img
                  src={user.profile_image_url}
                  alt="Profile"
                  className="profile-image rounded-circle mr-3"
                />
                <div>
                  <p className="mb-1">
                    <span className="user-name">{user.username}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CookLikesPage;
