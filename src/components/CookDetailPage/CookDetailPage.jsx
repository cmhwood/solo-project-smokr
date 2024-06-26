import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import './CookDetailPage.css';
import { useScript } from '../../hooks/useScript';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function CookDetails() {
  const user = useSelector((store) => store.user);
  const { cookId } = useParams();
  const history = useHistory();
  const [imageURLs, setImageURLs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    cook_name: '',
    cook_date: '',
    location: '',
    recipe_notes: '',
    cook_rating: 0,
    cook_rating_text: '',
    is_active: true,
    cook_image_urls: [],
  });

  useScript('https://widget.cloudinary.com/v2.0/global/all.js');

  useEffect(() => {
    fetchCookDetails();
    fetchComments();
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const fetchCookDetails = async () => {
    try {
      const response = await axios.get(`/api/cooks/${cookId}`);
      const {
        user_id,
        cook_name,
        cook_date,
        location,
        recipe_notes,
        cook_rating,
        cook_rating_text,
        is_active,
        cook_images,
      } = response.data;
      setFormData({
        user_id,
        cook_name,
        cook_date: moment(cook_date).format('MMMM Do, YYYY'),
        location,
        recipe_notes,
        cook_rating,
        cook_rating_text,
        is_active,
        cook_image_urls: cook_images || [],
      });
      setImageURLs(cook_images || []);
    } catch (error) {
      console.error('Error fetching cook details:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments?cookId=${cookId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const openWidget = () => {
    if (window.cloudinary) {
      window.cloudinary
        .createUploadWidget(
          {
            sources: ['local', 'url', 'camera'],
            cloudName: 'ddlkh3gov',
            uploadPreset: 'qaikv0iz',
            multiple: 'true',
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              setImageURLs((prevImageURLs) => [...prevImageURLs, result.info.secure_url]);
            }
          }
        )
        .open();
    }
  };

  const handleUpdateCook = async () => {
    try {
      const updatedFormData = {
        ...formData,
        cook_date: moment(formData.cook_date, 'MMMM Do, YYYY').format('YYYY-MM-DD'), // Convert to YYYY-MM-DD format
        cook_image_urls: imageURLs,
      };
      await axios.put(`/api/cooks/${cookId}`, updatedFormData);
      fetchCookDetails(); // Fetch updated details after successful update
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating cook:', error);
    }
  };

  const handleDeleteCook = async () => {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#172727',
      confirmButtonText: 'Yes, delete it!',
      background: '#eeeeee',
      color: '#172727',
      // border: '1px solid #bfbfbf'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const softDelete = {
            ...formData,
            is_active: false,
            cook_date: moment(formData.cook_date, 'MMMM Do, YYYY').format('YYYY-MM-DD'), // Format date for consistency
          };
          await axios.put(`/api/cooks/${cookId}`, softDelete);
          // Show success message after deletion
          // Swal.fire({
          //   title: 'Deleted!',
          //   text: 'Your file has been deleted.',
          //   icon: 'success',
          // });
          // Redirect to /cooks after successful deletion
          history.push('/cooks');
        } catch (error) {
          console.error('Error deleting cook:', error);
          // Show error message if deletion fails
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete cook.',
            icon: 'error',
          });
        }
      }
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    window.scrollTo(0, 0);
  };

  const handleFormDataChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post('/api/comments', {
        cook_id: cookId,
        user_id: user.id,
        comment_text: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteImage = (index) => {
    setImageURLs(imageURLs.filter((_, i) => i !== index));
  };

  return (
    <div className='cook-details'>
      {editMode ? (
        <div className='card edit-form'>
          <div className='card-body'>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                name='cook_name'
                value={formData.cook_name}
                onChange={handleFormDataChange}
                placeholder='Cook Name'
              />
            </div>
            <div className='form-group'>
              <input
                type='date'
                className='form-control'
                name='cook_date'
                value={formData.cook_date}
                onChange={handleFormDataChange}
                placeholder='Cook Date'
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                name='location'
                value={formData.location}
                onChange={handleFormDataChange}
                placeholder='Location'
              />
            </div>
            <div className='form-group'>
              <select
                className='form-control custom-select'
                name='cook_rating'
                value={formData.cook_rating}
                onChange={handleFormDataChange}
              >
                <option value='1'>🔥</option>
                <option value='2'>🔥🔥</option>
                <option value='3'>🔥🔥🔥</option>
                <option value='4'>🔥🔥🔥🔥</option>
                <option value='5'>🔥🔥🔥🔥🔥</option>
              </select>
            </div>
            <div className='form-group'>
              <textarea
                className='form-control'
                name='recipe_notes'
                value={formData.recipe_notes}
                onChange={handleFormDataChange}
                placeholder='Recipes & Notes'
                rows={formData.recipe_notes.split('\n').length} // Set initial rows based on content
                style={{ minHeight: '100px', resize: 'vertical' }} // Apply CSS styles
              ></textarea>
            </div>

            <div className='form-group text-center'>
              <button type='button' className='btn' onClick={openWidget}>
                Upload More Images
              </button>
            </div>
            <div className='form-group'>
              <div className='d-flex flex-wrap justify-content-center'>
                {imageURLs.map((url, index) => (
                  <div key={index} className='image-preview'>
                    <img src={url} alt={`Uploaded ${index}`} />
                    <button
                      type='button'
                      className='btn btn-danger btn-sm delete-button'
                      onClick={() => handleDeleteImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className='form-group text-center'>
              <button className='btn btn-success' onClick={handleUpdateCook}>
                Save
              </button>
              <button className='btn btn-secondary' onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='container-fluid px-0'>
          <h2 className='my-4'>{formData.cook_name}</h2>

          <div className='view-details'>
            <p>
              {/* Cook Date:  */}
              <img className='speech-bubble' src='../images/date-24.png' alt='Date' />
              {formData.cook_date}
            </p>
            <p>
              {/* Location:  */}
              <img className='speech-bubble' src='../images/location-24.png' alt='Location' />
              {formData.location}
            </p>
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {/* Recipe Notes:  */}
              <img
                className='speech-bubble'
                src='../images/knife-and-spatchula-24.png'
                alt='Kitchen knife and spatula'
              />
              {formData.recipe_notes}
            </p>
            <p>
              {/* Cook Rating:  */}
              <img className='speech-bubble' src='../images/flame-24.png' alt='Flame' />
              {formData.cook_rating_text}
            </p>
            <div className='cook-images-detail'>
              {formData.cook_image_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Cook Image ${index}`}
                  className={`cook-image-detail ${
                    index === 0 ? 'cook-image-detail-large' : 'cook-image-detail-large'
                  }`}
                />
              ))}
            </div>
            {user.id === formData.user_id && (
              <>
                <button className='btn' onClick={handleEditToggle}>
                  {/* Edit */}
                  <img className='speech-bubble' src='../images/edit-24.png' alt='Edit' />
                </button>
                <button className='btn' onClick={handleDeleteCook}>
                  {/* Delete */}
                  <img className='speech-bubble' src='../images/delete-24.png' alt='Delete' />
                </button>
              </>
            )}
            <div className='comments-section'>
              <div className='comment-header'>
                <img
                  className='com-speech-bubble'
                  src='../images/color-bubble-50.png'
                  alt='Comment bubble'
                />
                <h2 className='comment-title'>Comments</h2>
              </div>
              {comments.map((comment) => (
                <div key={comment.comment_id} className='comment'>
                  <div className='comment-user'>
                    {user.profile_image_url ? (
                      <img
                        className='com-profile-image'
                        src={user.profile_image_url}
                        alt='Profile'
                      />
                    ) : (
                      <img
                        className='com-profile-icon'
                        src='./images/default-profile.jpg'
                        alt='Profile icon'
                      />
                    )}
                    <strong>{comment.username}</strong>
                  </div>
                  <div className='comment-text'>{comment.comment_text}</div>
                </div>
              ))}
              {user && (
                <div className='add-comment'>
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder='Add a comment...'
                    className='form-control'
                  ></textarea>
                  <button
                    className='btn'
                    onClick={handleAddComment}
                    disabled={!newComment.trim()} // Disable button if newComment is empty or whitespace
                  >
                    Post Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CookDetails;
