import { createSlice } from '@reduxjs/toolkit';

export const deckhandSlice = createSlice({
  name: 'deckhand',
  initialState: {
    user: {},
    // user: {
    //   id: 1,
    //   name: 'John',
    //   email: 'john@example.com',
    //   avatarUrl: 'http://example.com',
    //   githubId: null,
    //   awsAccessKey: null,
    //   awsSecretKey: null,
    // },

    // projects: [],
    projects: [
      {
        id: 1,
        name: 'Project 1',
        createdDate: 'Fri Dec 06 2023 11:51:09 GMT-0500 (Eastern Standard Time)',
        modifiedDate: 'Fri Dec 08 2023 11:51:09 GMT-0500 (Eastern Standard Time)',
        externalId: null,
        config: { provider: 'aws', awsRegion: 'US-East' },
        clusters: [
          {
            id: 1,
            name: 'Cluster 1',
            config: { instanceType: 't2.micro', minNodes: 1, maxNodes: 3, desiredNodes: 2 }, // instanceType is immutable, min/max is adjustable
            pods: [
              {
                id: 1,
                name: 'Moodsight',
                type: 'github',
                config: true,
                githubRepo: 'o-mirza/Moodsight',
                githubBranch: 'main',
                replicas: 3,
                variables: [],
                host: 'moodsight.io',
                path: '/path',
                volume: null,
                deployed: false,
              },
              {
                id: 2,
                name: 'postgres',
                type: 'docker-hub',
                config: true,
                imageName: 'postgres',
                imageTag: 'bullseye',
                replicas: 1,
                variables: [{ key: 'user1', value: 'abc123', secret: true }, { key: 'PG_URI', value: 'db_address', secret: false }],
                ingress: null,
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
    modal: null, // active modal name
  },
  reducers: {
    setUser: (state, action) => { // payload: users (merge properties)
      const mergeUser = action.payload;
      Object.assign(state.user, mergeUser);
    },
    setProjects: (state, action) => { // payload: projects (fetch full state object from SQL)
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
    setModal: (state, action) => { // payload: modal name
      state.modal = action.payload;
    },
    addProject: (state, action) => { // payload: {id, createdDate, modifiedDate}
      const { id, createdDate, modifiedDate } = action.payload;
      state.projects.push({
        id: id,
        externalId: null,
        name: `Project ${state.projects.length + 1}`,
        config: null,
        createdDate: new Date(),
        modifiedDate: new Date(),
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
      state.projects = state.projects.filter(p => p.id !== action.payload)
    },
    configureProject: (state, action) => { // payload: {projectId, config}
      const { projectId, config } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      project.name = config.name;
      project.modifiedDate = new Date()
      project.config = config;
    },
    addCluster: (state, action) => { // payload: {projectId, clusterId}
      const { projectId, clusterId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      project.clusters.push({
        id: clusterId,
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
      cluster.name = config.name;
      cluster.config = config;
    },
    addPod: (state, action) => { // payload: {projectId, clusterId, podId, type}
      const { projectId, clusterId, podId, type } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      cluster.pods.push({
        id: podId,
        name: `Pod ${cluster.pods.length + 1}`,
        type: type,
        config: false,
        replicas: 3,
        variables: [],
        deployed: false,
      });
    },
    deletePod: (state, action) => { // payload: {projectId, clusterId, podId}
      const { projectId, clusterId, podId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      cluster.pods = cluster.pods.filter(p => p.id !== podId)
    },
    configurePod: (state, action) => { // payload: {projectId, clusterId, podId, mergePod}
      const { projectId, clusterId, podId, mergePod } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      const pod = cluster.pods.find(p => p.id === podId);
      Object.assign(pod, mergePod);
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
  setModal,
  addProject,
  deleteProject,
  configureProject,
  addCluster,
  deleteCluster,
  configureCluster,
  addPod,
  deletePod,
  configurePod,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;