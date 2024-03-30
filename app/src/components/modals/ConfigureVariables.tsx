import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showModal, updateNode } from '../../deckhandSlice';

export default function () {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const id = state.modal.id;
  const data = state.modal.data;

  const [show, setShow] = useState(false);
  const [inputs, setInputs] = useState(
    data.variables || [{ key: '', value: '', secret: true }],
  );

  useEffect(() => {
    setShow(true);
  }, []);

  const handleInputChange = (index: any, event: any) => {
    const values = [...inputs];
    const updatedValue = {
      ...values[index],
      [event.target.name]:
        event.target.name === 'secret'
          ? event.target.checked
          : event.target.value,
    };
    values[index] = updatedValue;
    setInputs(values);
  };

  const addRow = () => {
    setInputs([...inputs, { key: '', value: '', secret: false }]);
  };

  const deleteRow = (index: any) => {
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(updateNode({ id, data: { variables: inputs } }));
    closeModal();
  };

  // Finds all GitHub nodes connected to a node with the given id
  // Returns array of the GitHub nodes' ids
  const findConnectedGitHubNodes = (id: number): number[] => {
    const nodes: any[] = state.nodes;
    const edges: any[] = state.edges;

    const connectedNodeIds: number[] = edges
      .filter((edge) => edge.target === id)
      .map((edge) => edge.source);

    const gitHubIds: number[] = nodes
      .filter(
        (node) => node.type === 'github' && connectedNodeIds.includes(node.id),
      )
      .map((node) => node.id);

    return gitHubIds;
  };

  const loadEnv = async () => {
    // TODO:
   
    const connectedGitHubNodes = findConnectedGitHubNodes(id);
    console.log({ connectedGitHubNodes });
    // const response = await fetch('/api/github/scan', {
    //   method: 'POST',
    //   body: JSON.stringify({}),
    // });
    // const envs = await response.json();
    // // returns array of variable names
    // // const { repo, branch } = req.body;
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Variables</h2>
        <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Secret</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inputs.map((input: any, index: any) => (
                <tr key={index}>
                  <td>
                    <input
                      title="key"
                      type={'text'}
                      name="key"
                      value={input.key}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      title="value"
                      type={input.secret ? 'password' : 'text'}
                      name="value"
                      value={input.value}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      title="secret"
                      type="checkbox"
                      name="secret"
                      checked={input.secret}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => deleteRow(index)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="buttons">
            <button type="button" onClick={loadEnv}>
              Load envs
            </button>
            <button type="button" onClick={addRow}>
              Add Row
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="blue">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
