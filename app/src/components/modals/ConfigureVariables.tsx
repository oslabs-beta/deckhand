import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, updateNode } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const id = state.modal.id;
  const data = state.modal.data;

  const [show, setShow] = useState(false);
  const [inputs, setInputs] = useState(
    data.variables || [{ key: "", value: "", secret: true }]
  );

  useEffect(() => {
    setShow(true);
  }, []);

  const handleInputChange = (index: any, event: any) => {
    const values = [...inputs];
    const updatedValue = {
      ...values[index],
      [event.target.name]:
        event.target.name === "secret"
          ? event.target.checked
          : event.target.value,
    };
    values[index] = updatedValue;
    setInputs(values);
  };

  const addRow = () => {
    setInputs([...inputs, { key: "", value: "", secret: false }]);
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

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Variables</h2>
        <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
                // @ts-expect-error TS(2322): Type '{ children: string; type: string; }' is not ... Remove this comment to see the full error message
                // @ts-expect-error TS(2322) FIXME: Type '{ children: string; type: string; }' is not ... Remove this comment to see the full error message
                <th type="label">Key</th>
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
                      type={"text"}
                      name="key"
                      value={input.key}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type={input.secret ? "password" : "text"}
                      name="value"
                      value={input.value}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
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
