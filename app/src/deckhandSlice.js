import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
  name: 'deckhand',
  initialState: {
    user: null,
    // user: {
    //   id: 1,
    //   name: 'John',
    //   avatarUrl: 'http://example.com',
    //   linkedAccounts: {
    //     github: null,
    //     aws: null,
    //     gcp: null,
    //     azure: null,
    //     harbor: null,
    //   }
    // },

    projects: [
      {
        id: 1,
        name: 'Project 1',
        createdDate: 'Nov 29, 2023',
        modifiedDate: 'Nov 30, 2023',
        clusters: [
          {
            id: 1,
            name: 'Cluster 1',
            config: { provider: 'AWS', name: '', region: 'US-East' },
            pods: [
              {
                id: 1,
                name: 'Pod 1 (github)',
                type: 'github',
                config: { url: 'http://example.com', build: '1.0.5', branch: 'main' },
                replicas: 1,
                variables: null, // [{key: value, secret as Boolean}, ...]
                ingress: null, // port number
                volume: null, // directory string
                deployed: false,
              },
              {
                id: 2,
                name: 'Pod 2 (docker-hub)',
                type: 'docker-hub',
                config: { url: 'http://example.com', version: '3.5.1' },
                replicas: 1,
                variables: null, // [{key: value, secret as Boolean}, ...]
                ingress: null, // port number
                volume: null, // directory string
                deployed: false,
              },
            ]
          },
        ]
      },
    ],

    projectId: null, // id
  },
  reducers: {
    setUser: (state, action) => { // payload: {id, name, avatarUrl}
      state.user = action.payload;
    },
    setProjects: (state, action) => { // payload: (full state object from SQL)
      state.projects = action.payload;
    },
    setProjectId: (state, action) => { // payload: id
      state.projectId = action.payload;
    },
    addProject: (state, action) => { // payload: {id, createdDate, modifiedDate}
      const { id, createdDate, modifiedDate } = action.payload;
      state.projects.push({
        id: id, // change to projectId from SQL once connected
        name: `Project ${state.projects.length + 1}`,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        clusters: [
          {
            id: 1,
            name: 'Cluster 1',
            config: null,
            pods: [],
          }
        ],
      });
    },
    deleteProject: (state, action) => { // payload: id
      state.projects = state.projects.filter(project => project.id !== action.payload)
    },
    addCluster: (state, action) => { // payload: {projectId, clusterId}
      const { projectId, clusterId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      // project.modifiedDate = (today's date) or get from SQL?
      project.clusters.push({
        id: clusterId, // change to clusterId from SQL once connected
        name: `Cluster ${project.clusters.length + 1}`,
        config: null,
        pods: [],
      });
    },
    deleteCluster: (state, action) => { // payload: {projectId, clusterId}
      const { projectId, clusterId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      project.clusters = project.clusters.filter(c => c.id !== clusterId);
    },
    addPod: (state, action) => { // payload: {projectId, clusterId, type}
      const { projectId, clusterId, type } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      cluster.pods.push({
        id: cluster.pods.length + 1,
        name: `Pod ${cluster.pods.length + 1} (${type})`,
        type: type,
        config: null,
        replicas: 1,
        variables: null,
        ingress: null,
        volume: null,
        deployed: false,
      });
    },
    deletePod: (state, action) => { // payload: {projectId, clusterId, podId}
      const { projectId, clusterId, podId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      cluster.pods = cluster.pods.filter(p => p.id !== podId)
    },
    configurePod: (state, action) => { // payload: {projectId, clusterId, podId, config}
      const { projectId, clusterId, podId, config } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      const pod = cluster.pods.find(p => p.id === podId);
      pod.config = config;
    },
  },
});

// Export actions for use in components
export const {
  setUser,
  setProjects,
  setProjectId,
  addProject,
  deleteProject,
  addCluster,
  deleteCluster,
  addPod,
  deletePod,
  configurePod,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;