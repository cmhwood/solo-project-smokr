import { takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';

function* likeCookSaga(action) {
  try {
    yield call(axios.post, '/api/likes', { cookId: action.payload });
    // Optionally, you can fetch the updated cooks list
    yield put({ type: 'FETCH_COOKS' });
  } catch (error) {
    console.error('Error liking cook:', error);
  }
}

function* watchLikeCook() {
  yield takeEvery('LIKE_COOK', likeCookSaga);
}

export default watchLikeCook;
