import { configureStore } from "@reduxjs/toolkit";
import dictionariesReducer from "./dictionariesStore";
import { updateDictionaries } from "../utils";

export const store = configureStore({
    reducer: {
        dictionaries: dictionariesReducer,
    },
});

store.subscribe(() => {
    updateDictionaries(store.getState().dictionaries);
});

// Infer types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
