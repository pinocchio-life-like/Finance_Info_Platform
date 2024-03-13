import { createSlice } from "@reduxjs/toolkit";

const contentsSlice = createSlice({
  name: "tableOfContents",
  initialState: {
    status: false,
  },
  reducers: {
    changeTableOfContentsState: (state, action) => {
      state.status = action.payload.status;
    },
  },
});

export const { changeTableOfContentsState } = contentsSlice.actions;

export default contentsSlice.reducer;
