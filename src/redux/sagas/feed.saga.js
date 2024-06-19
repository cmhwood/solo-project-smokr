import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchCooks() {
  try {
    const response = yield axios.get('/api/feed');
    yield put({ type: 'SET_COOKS', payload: response.data });
  } catch (error) {
    console.error('Error getting cooks');
  }
}

function* feedSaga() {
  yield takeLatest('FETCH_COOKS', fetchCooks);
}

export default feedSaga;
