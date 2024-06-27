const feedReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_COOKS':
      return action.payload;
    case 'LIKE_COOK':
      return state.map((cook) =>
        cook.id === action.payload
          ? {
              ...cook,
              liked: !cook.liked,
              like_count: cook.liked ? cook.like_count - 1 : cook.like_count + 1,
            }
          : cook
      );
    default:
      return state;
  }
};

export default feedReducer;
