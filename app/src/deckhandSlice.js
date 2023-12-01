import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
    name: 'deckhand',
    initialState: {
        user: null,
        // user: { name: 'John' }, // {id, name, photo_url, ...},

        projectArr: [
            { id: 1, name: 'Example App', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023' },
            { id: 2, name: 'Example App', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023' },
            { id: 3, name: 'Example App', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023' },
            { id: 4, name: 'Example App', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023' },
            { id: 5, name: 'Example App', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023' },
            { id: 6, name: 'Example App', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023' },
        ], // [ {id, name, created_date, modified_date, ...}, ... ]

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