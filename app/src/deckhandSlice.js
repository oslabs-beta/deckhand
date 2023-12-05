import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
  name: 'deckhand',
  initialState: {
    // user: null,
    user: {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      avatarUrl: 'http://example.com',
      linkedAccounts: {
        github: null,
        aws: { accessKey: 'xyz', secretKey: 'xyz' },
        gcp: null,
        azure: null,
        harbor: null,
      },
    },

    projects: [
      {
        id: 1,
        externalId: null,
        name: 'Project 1',
        config: { provider: 'aws', name: 'Default VPC', region: 'US-East' },
        createdDate: 'Nov 29, 2023',
        modifiedDate: 'Nov 30, 2023',
        clusters: [
          {
            id: 1,
            externalId: null,
            name: 'Cluster 1',
            config: { name: 'Cluster 1', instanceType: 't2.micro', minNodes: 1, maxNodes: 3 }, // instanceType is immutable, min/max is adjustable
            pods: [
              {
                id: 1,
                name: 'Pod 1 (github)',
                type: 'github',
                config: { url: 'http://example.com', build: '1.0.5', branch: 'main' },
                replicas: 3,
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

    projectId: null, // selected project id
    clusterId: null, // selected cluster id
    podId: null, // selected pod id
  },
  reducers: {
    setUser: (state, action) => { // payload: {id, name, email, avatarUrl}
      state.user = action.payload;
    },
    setProjects: (state, action) => { // payload: projects (full state object from SQL)
      state.projects = action.payload;
    },
    setProjectId: (state, action) => { // payload: projectId
      state.projectId = action.payload;
    },
    setClusterId: (state, action) => { // payload: clusterId
      state.clusterId = action.payload;
    },
    setPodId: (state, action) => { // payload: podId
      state.podId = action.payload;
    },
    addProject: (state, action) => { // payload: {id, createdDate, modifiedDate}
      const { id, createdDate, modifiedDate } = action.payload;
      state.projects.push({
        id: id,
        externalId: null,
        name: `Project ${state.projects.length + 1}`,
        config: null,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        clusters: [
          {
            id: 1,
            externalId: null,
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
      project.clusters.push({
        id: clusterId,
        externalId: null,
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
    configureCluster: (state, action) => { // payload: {projectId, clusterId, config}
      const { projectId, clusterId, config } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      cluster.config = config;
    },
    addPod: (state, action) => { // payload: {projectId, clusterId, podId, type}
      const { projectId, clusterId, podId, type } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      cluster.pods.push({
        id: podId,
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
  setClusterId,
  setPodId,
  addProject,
  deleteProject,
  addCluster,
  deleteCluster,
  configureCluster,
  addPod,
  deletePod,
  configurePod,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;