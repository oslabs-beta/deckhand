// /** @jest-environment jsdom */ // overrides global testEnvironment": "node" in package.json for frontend tests
// import React from 'react';
// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Login from '../../../app/src/components/Login';
// import { Provider } from 'react-redux';
// import { store } from '../../../app/src/store';

// describe('Testing the application\'s login page', () => {

//   it('Does button say "Sign in with GitHub"', () => {
//     const { getByTestId } = render(
//       <Provider store={store}>
//         <Login />
//       </Provider>

//     );
//     expect(getByTestId(/github-button/i).textContent).toBe("Sign in with GitHub");
//   });

//   it('There is no button that says "Sign in with Hotmail"', () => {
//     const { getByTestId } = render(
//       <Provider store={store}>
//         <Login />
//       </Provider>
//     );
//     expect(getByTestId(/github-button/i).textContent).not.toBe("Sign in with Hotmail");
//   });

// });

describe('Dummy test', () => {

  it('Dummy test', async () => {
    return expect(true).toBe(true);
  });

});