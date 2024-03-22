import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleName: "",
    articleContent: "",
    category_Id: null,
    action: null,
  },
  reducers: {
    addArticleState: (state, action) => {
      state.articleName = action.payload.articleName;
      state.articleContent = action.payload.articleContent;
      state.category_Id = action.payload.category_Id;
      state.action = action.payload.action;
    },
  },
});

export const { addArticleState } = articleSlice.actions;

export default articleSlice.reducer;
