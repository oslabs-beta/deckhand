import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import {
  showModal,
  updateNode,
  deleteNode,
  updateEdge,
  configureProject,
} from '../../deckhandSlice';
import Icon from '@mdi/react';
import { mdiDotsVertical, mdiDotsHexagon } from '@mdi/js';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClickStart = async () => {
    dispatch(updateNode({ id, data: { status: 'creating' } }));

    let project = state.projects.find(
      (project) => project.projectId === state.projectId
    );

    let node = state.nodes.find((node) => node.id === id);

    let data;

    if (!project.vpcId) {
      let res = await fetch('/api/deployment/addVPC', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: project.provider,
          name: project.name,
          vpcRegion: project.vpcRegion,
          awsAccessKey: state.user.awsAccessKey,
          awsSecretKey: state.user.awsSecretKey,
          userId: state.user.id,
          projectId: project.projectId,
          projectName: project.name,
        }),
      });
      data = await res.json();
      console.log('VPC Done! ID:', data.externalId);
      dispatch(
        configureProject({
          projectId: project.projectId,
          vpcId: data.externalId,
        })
      );
    }

    // // Add 1 second delay to simulate fetch request
    // setTimeout(() => {
    //   dispatch(updateNode({ id, data: { status: "running" } }));
    //   const edges = state.edges.filter((edge) => edge.source === id);
    //   edges.map((edge) =>
    //     dispatch(updateEdge({ id: edge.id, animated: true }))
    //   );
    // }, 1000);

    console.log('All project data:', project);
    console.log('About to fetch addCluster, ', data.externalId);

    let res = await fetch('/api/deployment/addCluster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        externalId: project.vpcId || data.externalId,
        name: node.data.name,
        instanceType: node.data.instanceType,
        minNodes: node.data.minNodes,
        maxNodes: node.data.maxNodes,
        desiredNodes: node.data.desiredNodes,
        userId: state.user.id,
        projectId: project.projectId,
      }),
    });
    data = await res.json();
    console.log('cluster made! Volume handle: ', data.volumeHandle);

    dispatch(
      updateNode({
        id,
        data: { volumeHandle: data.volumeHandle, status: 'running' },
      })
    );
    const edges = state.edges.filter((edge) => edge.source === id);
    edges.map((edge) => dispatch(updateEdge({ id: edge.id, animated: true })));
  };

  const handleClickStop = () => {
    dispatch(updateNode({ id, data: { status: 'stopping' } }));
    const edges = state.edges.filter((edge) => edge.source === id);
    edges.map((edge) => dispatch(updateEdge({ id: edge.id, animated: false })));

    // Add 1 second delay to simulate fetch request
    setTimeout(() => {
      dispatch(updateNode({ id, data: { status: null } }));
    }, 1000);
  };

  const getConnectedPods = () => {
    const edges = state.edges.filter((edge) => edge.source === id);
    return state.edges
      .filter((edge) => edge.source === id)
      .map((edge) => state.nodes.find((node) => node.id === edge.target));
  };

  const countDeployedPods = () => {
    const pods = getConnectedPods();
    return pods.filter((pod) => pod.data.status === 'running').length;
  };

  return (
    <div className={`node ${data.status === 'running' ? 'running' : ''}`}>
      <Handle
        type='target'
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className='node-menu' aria-label='Customise options'>
              <Icon path={mdiDotsVertical} size={1} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className='dropdown'
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu.Item
                className='dropdown-item'
                onClick={() =>
                  dispatch(showModal({ name: 'ConfigureCluster', id, data }))
                }
              >
                Configure
              </DropdownMenu.Item>
              <DropdownMenu.Separator className='dropdown-separator' />
              <DropdownMenu.Item
                className='dropdown-item'
                onClick={() => dispatch(deleteNode(id))}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className='icon'>
          <Icon path={mdiDotsHexagon} style={{ color: 'red' }} size={1} />
        </div>
        <div className='title'>{data.name ? data.name : 'Cluster'}</div>
        {!data.instanceType ||
        !data.minNodes ||
        !data.maxNodes ||
        !data.desiredNodes ? (
          <button
            className='button nodrag'
            onClick={() =>
              dispatch(showModal({ name: 'ConfigureCluster', id, data }))
            }
          >
            Configure
          </button>
        ) : !data.status ? (
          <button className='button nodrag' onClick={handleClickStart}>
            Start Instance
          </button>
        ) : data.status === 'creating' ? (
          <button className='button busy nodrag'>Creating instance...</button>
        ) : data.status === 'stopping' ? (
          <button className='button busy nodrag'>Stopping instance...</button>
        ) : (
          <>
            <div
              style={{
                fontSize: '14px',
                paddingBottom: '10px',
              }}
            >
              <b>{countDeployedPods()}</b> of{' '}
              <b>{state.edges.filter((edge) => edge.source === id).length}</b>{' '}
              pods deployed
            </div>
            <button className='button stop nodrag' onClick={handleClickStop}>
              Stop Instance
            </button>
          </>
        )}
      </div>
      <Handle
        type='source'
        position={Position.Bottom}
        id='b'
        isConnectable={isConnectable}
      />
    </div>
  );
}
