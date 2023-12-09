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
        name: 'Project 1', // store as tag in AWS to allow renaming
        createdDate: 'Fri Dec 07 2023 11:51:09 GMT-0500 (Eastern Standard Time)',
        modifiedDate: 'Fri Dec 08 2023 19:51:09 GMT-0500 (Eastern Standard Time)',
        provider: 'aws', // immutable once VPC provisioned (destroying and recreating will break external connections)
        vpcId: 'xyz', // unique identifier provided by AWS once VPC provisioned
        vpcRegion: 'US-East', // immutable once VPC provisioned (destroying and recreating will break external connections)
        clusters: [
          {
            id: 1, // store as unique identifier in AWS
            name: 'Cluster 1', // store as tag in AWS to allow renaming
            instanceType: 't2.micro', // changing after provisioning requires destroying and recreating the EKS (should not break external connections)
            minNodes: 1,
            maxNodes: 3,
            desiredNodes: 2,
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
        name: `Project ${state.projects.length + 1}`,
        createdDate: new Date().toString(),
        modifiedDate: new Date().toString(),
        clusters: [],
      });
    },
    deleteProject: (state, action) => { // payload: id
      state.projects = state.projects.filter(p => p.id !== action.payload)
    },
    configureProject: (state, action) => { // payload: {projectId, mergeProject}
      const { projectId, mergeProject } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      Object.assign(project, mergeProject);
    },
    addCluster: (state, action) => { // payload: {projectId, clusterId}
      const { projectId, clusterId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      project.clusters.push({
        id: clusterId,
        name: `Cluster ${project.clusters.length + 1}`,
        config: false,
        pods: [],
      });
    },
    deleteCluster: (state, action) => { // payload: {projectId, clusterId}
      const { projectId, clusterId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      project.clusters = project.clusters.filter(c => c.id !== clusterId);
    },
    configureCluster: (state, action) => { // payload: {projectId, clusterId, mergeCluster}
      const { projectId, clusterId, mergeCluster } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      const cluster = project.clusters.find(c => c.id === clusterId);
      Object.assign(cluster, mergeCluster);
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