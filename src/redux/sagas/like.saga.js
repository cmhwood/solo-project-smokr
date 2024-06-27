// This saga is not used
import { put, takeLatest, all, call } from 'redux-saga/effects';
import axios from 'axios';

function* fetchLikedUsers(cookId) {
  try {
    const response = yield axios.get(`/api/likes/${cookId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching liked users:', error);
    return [];
  }
}

function* fetchCooks() {
  try {
    const [cooksResponse, likesResponse] = yield all([
      axios.get('/api/feed'), // Fetch cooks
      axios.get('/api/likes'), // Fetch likes for cooks
    ]);

    const cooks = yield all(
      cooksResponse.data.map(function* (cook) {
        const likedUsers = yield call(fetchLikedUsers, cook.id);
        return {
          ...cook,
          like_count: likesResponse.data.filter((like) => like.post_id === cook.id).length,
          likedUsers,
        };
      })
    );

    yield put({ type: 'SET_ALL_COOKS', payload: cooks });
  } catch (error) {
    console.error('Error getting cooks:', error);
  }
}

function* feedSaga() {
  yield takeLatest('FETCH_COOKS', fetchCooks);
}

export default feedSaga;
