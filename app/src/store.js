import { configureStore } from '@reduxjs/toolkit';
import deckhandReducer from './deckhandSlice.js';

export const store = configureStore({
    reducer: {
        deckhand: deckhandReducer,
    },
});
