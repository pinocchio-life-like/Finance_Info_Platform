import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleName: null,
    articleContent: null,
    category_Id: null,
  },
  reducers: {
    addArticleState: (state, action) => {
      state.articleName = action.payload.articleName;
      state.articleContent = action.payload.articleContent;
      state.category_Id = action.payload.category_Id;
    },
  },
});

export const { addArticleState } = articleSlice.actions;

export default articleSlice.reducer;
