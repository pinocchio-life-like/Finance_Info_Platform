import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import articleReducer from "./slices/articleSlice";
import contentsReducer from "./slices/contentsSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedArticle = persistReducer(persistConfig, articleReducer);
const persistedContents = persistReducer(persistConfig, contentsReducer);

const store = configureStore({
  reducer: {
    article: persistedArticle,
    contents: persistedContents,
    // add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
