import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleName: null,
    articleContent: null,
    category_Id: null,
    action: null,
  },
  reducers: {
    addArticleState: (state, action) => {
      console.log("addArticleState action.payload: ", action.payload);
      state.articleName = action.payload.articleName;
      state.articleContent = action.payload.articleContent;
      state.category_Id = action.payload.category_Id;
      state.action = action.payload.action;
    },
  },
});

export const { addArticleState } = articleSlice.actions;

export default articleSlice.reducer;