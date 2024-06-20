const feedReducer = (state = [], action) => {
  if (action.type === 'SET_ALL_COOKS') {
    return action.payload;
  }
  return state;
};

export default feedReducer;
