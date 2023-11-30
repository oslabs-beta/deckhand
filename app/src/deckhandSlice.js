import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
    name: 'deckhand',
    initialState: {
        user: null, // {id, name, ...},
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

// Export actions for use in components
export const {
    setUser,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;