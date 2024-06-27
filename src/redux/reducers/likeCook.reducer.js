// This reducer is not used
const likesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_LIKED_USERS':
      return action.payload;
    default:
      return state;
  }
};

export default likesReducer;
