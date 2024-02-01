import { configureStore } from '@reduxjs/toolkit';
import deckhandReducer from './deckhandSlice';

export const store = configureStore({
  reducer: {
    deckhand: deckhandReducer,
  },
});
