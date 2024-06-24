import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchCommentsStart,
  fetchCommentsFailure,
  fetchCommentsSuccess,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
} from '../reducers/comments.reducer';

// Fetch comments
function* fetchCommentsSaga(action) {
  try {
    const response = yield call(axios.get, `/api/comments?cookId=${action.payload}`);
    yield put(fetchCommentsSuccess(response.data));
  } catch (error) {
    yield put(fetchCommentsFailure(error.message));
  }
}

// Add comment
function* addCommentSaga(action) {
  try {
    const response = yield call(axios.post, '/api/comments', action.payload);
    yield put(addCommentSuccess(response.data));
  } catch (error) {
    yield put(addCommentFailure(error.message));
  }
}

export function* commentsSaga() {
  yield takeLatest(fetchCommentsStart.type, fetchCommentsSaga);
  yield takeLatest(addCommentStart.type, addCommentSaga);
}
