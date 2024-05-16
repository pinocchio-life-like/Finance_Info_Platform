import { createSlice } from "@reduxjs/toolkit";

const contentsSlice = createSlice({
  name: "tableOfContents",
  initialState: {
    status: false,
    drop: [],
  },
  reducers: {
    changeTableOfContentsState: (state, action) => {
      state.status = action.payload.status;
      state.drop = action.payload.drop;
    },
  },
});

export const { changeTableOfContentsState } = contentsSlice.actions;

export default contentsSlice.reducer;
