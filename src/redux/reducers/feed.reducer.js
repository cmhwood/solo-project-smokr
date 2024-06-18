const feedReducer = (state = [], action) => {
    if (action.type === 'SET_COOKS') {
        return action.payload;
    }
    return state;
};

export default feedReducer;