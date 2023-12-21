const db = require('./model.js');

const reset = async () => {
  await db.query(`
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  --Drop existing tables if they exist
  DROP TABLE IF EXISTS users CASCADE;

  -- Create tables
  CREATE TABLE users (
    _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatarurl VARCHAR(255) DEFAULT NULL,
    githubid VARCHAR(255) DEFAULT NULL,
    awsaccesskey VARCHAR(255) DEFAULT NULL,
    awssecretkey VARCHAR(255) DEFAULT NULL,
    state JSONB DEFAULT '{ "projects": [{ "projectId": "5259", "name": "Brainstorm App", "createdDate": "Fri Dec 19 2023 11:51:09 GMT-0500 (Eastern Standard Time)", "modifiedDate": "Fri Dec 19 2023 19:51:09 GMT-0500 (Eastern Standard Time)", "provider": "aws", "vpcRegion": "us-east-1", "vpcId": "xyz" }], "nodes": [{ "id": "8345", "type": "cluster", "position": { "x": 737, "y": 109 }, "projectId": "5259", "data": { "name": "Cluster", "instanceType": "t2.micro", "minNodes": 1, "maxNodes": 3, "desiredNodes": 2 } }, { "id": "7250", "type": "github", "position": { "x": 490, "y": 352 }, "projectId": "5259", "data": { "name": "brainstormapp", "githubRepo": "Goblin-Shark-CS/brainstormapp", "githubBranch": "main", "githubBranches": ["Fix-IP-Address", "LoginPage", "LoginPageFix", "QR", "Websockets", "Websockets-Redux", "andrew/Mobile", "andrew/VoteButton", "andrew/renderMessage", "andrew/roomName", "andrew/sendMessage", "develop", "docker", "entries", "handshake", "initialize", "loginstyle.scss", "main", "o-mirza/frontend-setup", "omirza/develop", "votes"], "replicas": 3, "deployed": false } }, { "id": "8823", "type": "docker", "position": { "x": 928, "y": 355 }, "projectId": "5259", "data": { "name": "postgres", "imageName": "postgres", "imageTag": "latest", "imageTags": ["latest", "bullseye", "bookworm", "16.1-bullseye", "16.1-bookworm", "16.1", "16-bullseye", "16-bookworm", "16", "15.5-bullseye"], "replicas": 1, "deployed": false } }, { "id": "8075", "type": "ingress", "position": { "x": 211, "y": 680 }, "projectId": "5259", "data": {} }, { "id": "8038", "type": "variables", "position": { "x": 685, "y": 679 }, "projectId": "5259", "data": { "varSetId": "1", "podId": "1", "variables": [{ "key": "user1", "value": "abc123", "secret": true }, { "key": "PG_URI", "value": "db_address", "secret": false }] } }, { "id": "9634", "type": "volume", "position": { "x": 1152, "y": 676 }, "projectId": "5259", "data": { "mountPath": "/var/lib/postgresql/data" } }], "edges": [{ "id": "8345-7250", "source": "8345", "sourceHandle": "b", "target": "7250", "targetHandle": null, "projectId": "5259", "animated": false }, { "id": "7250-8075", "source": "7250", "sourceHandle": "b", "target": "8075", "targetHandle": null, "projectId": "5259", "animated": false }, { "id": "7250-8038", "source": "7250", "sourceHandle": "b", "target": "8038", "targetHandle": null, "projectId": "5259" }, { "id": "8823-8038", "source": "8823", "sourceHandle": "b", "target": "8038", "targetHandle": null, "projectId": "5259" }, { "id": "8345-8823", "source": "8345", "sourceHandle": "b", "target": "8823", "targetHandle": null, "projectId": "5259" }, { "id": "8823-9634", "source": "8823", "sourceHandle": "b", "target": "9634", "targetHandle": null, "projectId": "5259" }] }'
  );
`);
}

reset();