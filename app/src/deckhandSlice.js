import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
    name: 'deckhand',
    initialState: {
        user: null, // {id, name, ...},
        projectArr: null, // [ {id, name, created_date, modified_date, ...}, ... ]
        project: null, // id
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setProjectArr: (state, action) => {
            state.projectArr = action.payload;
        },
        setProject: (state, action) => {
            state.project = action.payload;
        },
    },
});

// Export actions for use in components
export const {
    setUser,
    setProjectArr,
    setProject,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;