const cooksReducer = (state = [], action) => {
  if (action.type === 'SET_COOKS') {
    return action.payload;
  }
  return state;
};

export default cooksReducer;
