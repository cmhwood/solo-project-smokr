import { put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';

function* fetchCooks() {
  try {
    const [cooksResponse, likesResponse] = yield all([
      axios.get('/api/feed'), // Fetch cooks
      axios.get('/api/likes'), // Fetch likes for cooks
    ]);

    console.log('Cooks response:', cooksResponse.data);
    console.log('Likes response:', likesResponse.data);

    const cooks = cooksResponse.data.map((cook) => ({
      ...cook,
      like_count: likesResponse.data.filter((like) => like.post_id === cook.id).length,
    }));

    yield put({ type: 'SET_ALL_COOKS', payload: cooks });
  } catch (error) {
    console.error('Error getting cooks:', error);
  }
}

function* feedSaga() {
  yield takeLatest('FETCH_COOKS', fetchCooks);
}

export default feedSaga;
