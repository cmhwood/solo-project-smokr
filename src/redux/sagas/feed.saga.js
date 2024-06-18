import { takeLatest } from "redux-saga/effects";

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