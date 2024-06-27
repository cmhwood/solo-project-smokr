// reducers/feedReducer.js
const feedReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_COOKS':
      return action.payload;
    default:
      return state;
  }
};

export default feedReducer;
