import { put, takeLatest, takeLeading } from 'redux-saga/effects';
import axios from 'axios';

function* fetchCooks() {
  try {
    const response = yield axios.get('/api/cooks');
    yield put({ type: 'SET_COOKS', payload: response.data });
  } catch (error) {
    console.error('Error getting cooks');
  }
}

function* addCook(action) {
  try {
    yield axios.post('/api/cooks', action.payload);
    yield put({ type: 'FETCH_COOKS' });
  } catch (error) {
    console.error(`Error adding new cook`);
  }
}

function* deleteCook(action) {
  try {
    yield axios.delete(`/api/cooks/${action.payload}`);
  } catch (error) {
    console.log('Error deleting cook');
  }
}

function* cooksSaga() {
  yield takeLatest('FETCH_COOKS', fetchCooks);
  yield takeLatest('ADD_COOK', addCook);
  yield takeLeading('DELETE_COOK', deleteCook);
}

export default cooksSaga;
