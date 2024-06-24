import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: 'idle',
    error: null,
  },
  reducers: {
    fetchCommentsStart: (state) => {
      state.loading = true;
    },
    fetchCommentsSuccess: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCommentStart: (state) => {
      state.loading = true;
    },
    addCommentSuccess: (state, action) => {
      state.loading = false;
      state.comments.push(action.payload);
    },
    addCommentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
} = commentsSlice.actions;

export default commentsSlice.reducer;
