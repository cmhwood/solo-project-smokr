const initialState = [];

const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_COOKS':
      return action.payload.map((cook) => ({
        ...cook,
        like_count: cook.like_count || 0, 
      }));
    case 'LIKE_COOK':
      return state.map((cook) =>
        cook.id === action.payload ? { ...cook, like_count: cook.like_count + 1 } : cook
      );
    default:
      return state;
  }
};

export default feedReducer;
