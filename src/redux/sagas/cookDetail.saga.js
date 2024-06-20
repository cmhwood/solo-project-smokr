import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchCookDetail(action) {
  try {
    const response = yield axios.get(`/api/cooks/${action.payload}`);
    yield put({ type: 'SET_COOK_DETAIL', payload: response.data });
  } catch (error) {
    console.error('Error getting cook details:', error);
  }
}

function* cookDetailSaga() {
  yield takeLatest('FETCH_COOK_DETAIL', fetchCookDetail);
}

export default cookDetailSaga;
