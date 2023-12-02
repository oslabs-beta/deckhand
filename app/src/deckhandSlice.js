import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
  name: 'deckhand',
  initialState: {
    user: null,
    // user: { id: 1, name: 'John', avatar_url: 'http://example.com' }, // {id, name, avatar_url},

    projects: [
      {
        id: 1, name: 'Example App 1', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023',
        clusters: [[
          {
            id: 1,
            type: 'github',
            configMap: null,
            secrets: null,
            ingress: null,
            volume: null,
          },
          {
            id: 2,
            type: 'docker-hub',
            configMap: null,
            secrets: null,
            ingress: null,
            volume: null,
          },
        ]]
      },
      { id: 2, name: 'Example App 2', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023', clusters: [[]] },
      { id: 3, name: 'Example App 3', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023', clusters: [[]] },
      { id: 4, name: 'Example App 4', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023', clusters: [[]] },
      { id: 5, name: 'Example App 5', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023', clusters: [[]] },
      { id: 6, name: 'Example App 6', created_date: 'Nov 29, 2023', modified_date: 'Nov 30, 2023', clusters: [[]] },
    ],

    projectId: null, // id
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
  },
});

// Export actions for use in components
export const {
  setUser,
  setProjects,
  setProjectId,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;