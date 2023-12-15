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

    projectId: null, // selected project id
    layout: 'cards', // cards or canvas
    modal: {}, // {name, data}

    projects: [
      {
        projectId: 1,
        name: 'Moodsight', // store as tag in AWS to allow renaming
        createdDate: 'Fri Dec 07 2023 11:51:09 GMT-0500 (Eastern Standard Time)',
        modifiedDate: 'Fri Dec 08 2023 19:51:09 GMT-0500 (Eastern Standard Time)',
        provider: 'aws', // immutable once VPC provisioned (destroying and recreating will break external connections)
        vpcId: 'xyz', // unique identifier provided by AWS once VPC provisioned
        vpcRegion: 'US-East', // immutable once VPC provisioned (destroying and recreating will break external connections),
      },
    ],

    clusters: [
      {
        clusterId: 1, // store as unique identifier in AWS
        projectId: 1,
        name: 'New Cluster', // store as tag in AWS to allow renaming
        instanceType: 't2.micro', // changing after provisioning requires destroying and recreating the EKS (should not break external connections)
        minNodes: 1,
        maxNodes: 3,
        desiredNodes: 2,
      },
    ],

    pods: [
      {
        podId: 1,
        clusterId: 1,
        name: 'Moodsight',
        type: 'github',
        config: true,
        githubRepo: 'o-mirza/Moodsight',
        githubBranch: 'main',
        githubBranches: ['main'],
        replicas: 3,
        deployed: false,
      },
      {
        podId: 2,
        clusterId: 1,
        name: 'postgres',
        type: 'docker-hub',
        config: true,
        imageName: 'postgres',
        imageTag: 'alpine3.19',
        imageTags: ['alpine3.19', 'alpine3.18', 'alpine', '16.1-alpine3.19', '16.1-alpine3.18', '16.1-alpine', '16-alpine3.19', '16-alpine3.18', '16-alpine', '15.5-alpine3.19', '15.5-alpine3.18', '15.5-alpine', '15-alpine3.19', '15-alpine3.18', '15-alpine', '14.10-alpine3.19', '14.10-alpine3.18', '14.10-alpine', '14-alpine3.19', '14-alpine3.18', '14-alpine', '13.13-alpine3.19', '13.13-alpine3.18', '13.13-alpine', '13-alpine3.19'],
        replicas: 1,
        deployed: false,
      },
    ],

    varSets: [
      {
        varSetId: 1,
        podId: 1,
        variables: [
          { key: 'user1', value: 'abc123', secret: true },
          { key: 'PG_URI', value: 'db_address', secret: false }
        ],
      },
    ],

    ingresses: [
      {
        ingressId: 1,
        podId: 1,
        host: 'example.com',
        path: '/path',
      },
    ],

    volumes: [
      {
        volumeId: 1,
        podId: 2,
        directory: '/mnt/data',
      },
    ],
  },
  reducers: {
    setUser: (state, action) => { // payload: users (merge properties)
      Object.assign(state.user, action.payload);
    },
    setState: (state, action) => { // payload: {projects, clusters, pods, varSets, ingresses, volumes}
      Object.assign(state, action.payload);
    },
    setProjectId: (state, action) => { // payload: projectId
      state.projectId = action.payload;
    },
    toggleLayout: (state, action) => {
      state.layout === 'cards' ? state.layout = 'canvas' : state.layout = 'cards';
    },
    showModal: (state, action) => { // payload: {name, data}
      state.modal = action.payload;
    },

    // Projects Reducers
    addProject: (state, action) => { // payload: projectId
      state.projects.push({
        projectId: action.payload,
        name: `Default Project`,
        createdDate: new Date().toString(),
        modifiedDate: new Date().toString(),
      });
    },
    deleteProject: (state, action) => { // payload: projectId
      state.projects = state.projects.filter(project => project.projectId !== action.payload);
      state.clusters.forEach(cluster => {
        if (cluster.projectId === action.payload) cluster.projectId = null;
      });
    },
    configureProject: (state, action) => { // payload: {projectId, ...props to merge...}
      const project = state.projects.find(project => project.projectId === action.payload.projectId);
      if (project) Object.assign(project, action.payload);
    },

    // Cluster Reducers
    addCluster: (state, action) => { // payload: { clusterId, projectId }
      state.clusters.push({
        clusterId: action.payload.clusterId,
        projectId: action.payload.projectId,
        name: `Default Cluster`,
      });
    },
    deleteCluster: (state, action) => { // payload: clusterId
      state.clusters = state.clusters.filter(cluster => cluster.clusterId !== action.payload);
      state.pods.forEach(pod => {
        if (pod.clusterId === action.payload) pod.clusterId = null;
      });
    },
    configureCluster: (state, action) => { // payload: {clusterId, ... props to merge...}
      const cluster = state.clusters.find(cluster => cluster.clusterId === action.payload.clusterId);
      if (cluster) Object.assign(cluster, action.payload);
    },

    // Pod Reducers
    addPod: (state, action) => { // payload: { podId, clusterId}
      state.pods.push({
        podId: action.payload.podId,
        clusterId: action.payload.clusterId,
        name: `New Pod`,
        replicas: 3,
      });
    },
    deletePod: (state, action) => { // payload: podId
      state.pods = state.pods.filter(pod => pod.podId !== action.payload);
      state.varSets.forEach(varSet => {
        if (varSet.podId === action.payload) varSet.podId = null;
      });
      state.ingresses.forEach(ingress => {
        if (ingress.podId === action.payload) ingress.podId = null;
      });
      state.volumes.forEach(volume => {
        if (volume.podId === action.payload) volume.podId = null;
      });
    },
    configurePod: (state, action) => { // payload: {podId, ...props to merge...}
      const pod = state.pods.find(pod => pod.podId === action.payload.podId);
      if (pod) Object.assign(pod, action.payload);
    },

    // VarSet Reducers
    addVarSet: (state, action) => { // payload: { varSetId, podId }
      state.varSets.push({
        varSetId: action.payload.varSetId,
        podId: action.payload.podId,
      });
    },
    deleteVarSet: (state, action) => { // payload: varSetId
      state.varSets = state.varSets.filter(varSet => varSet.varSetId !== action.payload);
    },
    configureVarSets: (state, action) => { // payload: {varSetId, ...props to merge...}
      const varSet = state.varSets.find(varSet => varSet.varSetId === action.payload.varSetId);
      if (varSet) Object.assign(varSet, action.payload);
    },

    // Ingress Reducers
    addIngress: (state, action) => { // payload: { ingressId, podId }
      state.ingresses.push({
        ingressId: action.payload.ingressId,
        podId: action.payload.podId,
      });
    },
    deleteIngress: (state, action) => { // payload: ingressId
      state.ingresses = state.ingresses.filter(ingress => ingress.ingressId !== action.payload);
    },
    configureIngress: (state, action) => { // payload: {ingressId, ...props to merge...}
      const ingress = state.ingresses.find(ingress => ingress.ingressId === action.payload.ingressId);
      if (ingress) Object.assign(ingress, action.payload);
    },

    // Volume Reducers
    addVolume: (state, action) => { // payload: { volumeId, podId }
      state.volumes.push({
        volumeId: action.payload.volumeId,
        podId: action.payload.podId,
        directory: '/mnt/data'
      });
    },
    deleteVolume: (state, action) => { // payload: volumeId
      state.volumes = state.volumes.filter(volume => volume.volumeId !== action.payload);
    },
    configureVolume: (state, action) => { // payload: {volumeId, ...props to merge...}
      const volume = state.volumes.find(volume => volume.volumeId === action.payload.volumeId);
      if (volume) Object.assign(volume, action.payload);
    },
  },
});

// Export actions for use in components
export const {
  setUser,
  setState,
  setProjectId,
  toggleLayout,
  showModal,

  addProject,
  deleteProject,
  configureProject,

  addCluster,
  deleteCluster,
  configureCluster,

  addPod,
  deletePod,
  configurePod,

  addVarSet,
  deleteVarSet,
  configureVarSet,

  addIngress,
  deleteIngress,
  configureIngress,

  addVolume,
  deleteVolume,
  configureVolume,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;