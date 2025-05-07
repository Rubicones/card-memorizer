import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dictionaries } from "@/app/page";

const initialState: Dictionaries = {};

const dictionariesSlice = createSlice({
    name: "dictionaries",
    initialState,
    reducers: {
        setDictionaries(_, action: PayloadAction<Dictionaries>) {
            return action.payload;
        },
    },
});

export const { setDictionaries } = dictionariesSlice.actions;
export default dictionariesSlice.reducer;
