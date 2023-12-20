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
    modal: {}, // {name, ...}

    projects: [
      {
        projectId: '5259',
        name: 'Brainstorm App', // store id+name as tag in AWS to allow renaming
        createdDate: 'Fri Dec 19 2023 11:51:09 GMT-0500 (Eastern Standard Time)',
        modifiedDate: 'Fri Dec 19 2023 19:51:09 GMT-0500 (Eastern Standard Time)',
        provider: 'aws', // immutable once VPC provisioned (destroying and recreating will break external connections)
        vpcRegion: 'us-east-1', // immutable once VPC provisioned (destroying and recreating will break external connections)
        vpcId: 'xyz', // unique identifier provided by AWS once VPC provisioned
      },
    ],

    nodes: [
      {
        id: '8345',
        type: 'cluster',
        position: { x: 719, y: 109 },
        projectId: '5259',
        data: {
          name: 'Cluster', // store id+name as tag in AWS to allow renaming
          instanceType: 't2.micro', // changing after provisioning requires destroying and recreating the EKS (should not break external connections)
          minNodes: 1,
          maxNodes: 3,
          desiredNodes: 2,
        },
      },
      {
        id: '7250',
        type: 'github',
        position: { x: 490, y: 352 },
        projectId: '5259',
        data: {
          name: 'brainstormapp',
          githubRepo: 'Goblin-Shark-CS/brainstormapp',
          githubBranch: 'main',
          githubBranches: ['main'],
          replicas: 3,
          deployed: false,
        },
      },
      {
        id: '8823',
        type: 'docker',
        position: { x: 928, y: 355 },
        projectId: '5259',
        data: {
          name: 'postgres',
          imageName: 'postgres',
          imageTag: 'latest',
          imageTags: ['latest', 'alpine3.19', 'alpine3.18', 'alpine', '16.1-alpine3.19', '16.1-alpine3.18', '16.1-alpine', '16-alpine3.19', '16-alpine3.18', '16-alpine', '15.5-alpine3.19', '15.5-alpine3.18', '15.5-alpine', '15-alpine3.19', '15-alpine3.18', '15-alpine', '14.10-alpine3.19', '14.10-alpine3.18', '14.10-alpine', '14-alpine3.19', '14-alpine3.18', '14-alpine', '13.13-alpine3.19', '13.13-alpine3.18', '13.13-alpine', '13-alpine3.19'],
          replicas: 1,
          deployed: false,
        },
      },
      {
        id: '8075',
        type: 'ingress',
        position: { x: 211, y: 680 },
        projectId: '5259',
        data: {},
      },
      {
        id: '8038',
        type: 'variables',
        position: { x: 685, y: 679 },
        projectId: '5259',
        data: {
          varSetId: '1',
          podId: '1',
          variables: [
            { key: 'user1', value: 'abc123', secret: true },
            { key: 'PG_URI', value: 'db_address', secret: false }
          ],
        },
      },
      {
        id: '9634',
        type: 'volume',
        position: { x: 1152, y: 676 },
        projectId: '5259',
        data: {
          mountPath: '/var/lib/postgresql/data',
        },
      },
    ],

    edges: [
      {
        id: '8345-7250',
        source: '8345',
        sourceHandle: 'b',
        target: '7250',
        targetHandle: null,
        projectId: '5259',
        animated: false,
      },
      {
        id: '7250-8075',
        source: '7250',
        sourceHandle: 'b',
        target: '8075',
        targetHandle: null,
        projectId: '5259',
        animated: false,
      },
      {
        id: '7250-8038',
        source: '7250',
        sourceHandle: 'b',
        target: '8038',
        targetHandle: null,
        projectId: '5259',
      },
      {
        id: '8823-8038',
        source: '8823',
        sourceHandle: 'b',
        target: '8038',
        targetHandle: null,
        projectId: '5259',
      },
      {
        id: '8345-8823',
        source: '8345',
        sourceHandle: 'b',
        target: '8823',
        targetHandle: null,
        projectId: '5259',
      },
      {
        id: '8823-9634',
        source: '8823',
        sourceHandle: 'b',
        target: '9634',
        targetHandle: null,
        projectId: '5259',
      },
    ],
  },
  reducers: {
    setUser: (state, action) => { // payload: user (merge props)
      Object.assign(state.user, action.payload);
    },
    setState: (state, action) => { // payload: {projects, nodes, edges}
      Object.assign(state, action.payload);
    },
    setProjectId: (state, action) => { // payload: projectId
      state.projectId = action.payload;
    },
    toggleLayout: (state, action) => {
      state.layout === 'cards' ? state.layout = 'canvas' : state.layout = 'cards';
    },
    showModal: (state, action) => { // payload: {name, ...}
      state.modal = action.payload;
    },

    // Project Reducers
    addProject: (state, action) => { // payload: projectId
      state.projects.push({
        projectId: action.payload,
        name: `Default Project`,
        createdDate: new Date().toString(),
        modifiedDate: new Date().toString(),
        provider: 'aws', // default
        vpcRegion: 'us-east-1', // default
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

    // Node Reducers
    addNode: (state, action) => { // payload: { id, type, data, position, projectId }
      state.nodes.push(action.payload);
    },
    deleteNode: (state, action) => { // payload: id
      state.nodes = state.nodes.filter(node => node.nodeId !== action.payload);
    },
    updateNode: (state, action) => {
      const node = state.nodes.find(node => node.id === action.payload.id);
      if (node) {
        // Copy previous data prop
        const previousData = { ...node.data };

        // Merge node with new properties (replacing data prop)
        Object.assign(node, action.payload);

        // Merge the previous and new data props
        if (action.payload.data) {
          node.data = { ...previousData, ...action.payload.data };
        }
      }
    },

    // Edge Reducers
    addNewEdge: (state, action) => { // payload: { id, ...params, project.id }
      state.edges.push(action.payload);
    },
    deleteEdge: (state, action) => { // payload: id
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    updateEdge: (state, action) => { // payload: { id, ...props to merge }
      const edge = state.edges.find(edge => edge.id === action.payload.id);
      if (edge) Object.assign(edge, action.payload);
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

  addNode,
  deleteNode,
  updateNode,

  addNewEdge,
  deleteEdge,
  updateEdge,
} = deckhandSlice.actions;

// Export the reducer function for store configuration
export default deckhandSlice.reducer;