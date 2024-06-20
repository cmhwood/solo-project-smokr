const cookDetailReducer = (state = null, action) => {
  if (action.type === 'SET_COOK_DETAIL') {
    return action.payload;
  }
  return state;
};

export default cookDetailReducer;
