/** @jest-environment jsdom */ // this line is needed. Please do not delete.
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../app/src/components/Login';
import { Provider } from 'react-redux';
import { store } from '../../../app/src/store.js';

// @ts-expect-error TS(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Testing the application\'s login page', () => {

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Does button say "Sign in with GitHub"', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>

    );
    // @ts-expect-error TS(2552) FIXME: Cannot find name 'expect'. Did you mean 'exec'?
    expect(getByTestId(/github-button/i).textContent).toBe("Sign in with GitHub");
  });

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('There is no button that says "Sign in with Hotmail"', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    // @ts-expect-error TS(2552) FIXME: Cannot find name 'expect'. Did you mean 'exec'?
    expect(getByTestId(/github-button/i).textContent).not.toBe("Sign in with Hotmail");
  });

});