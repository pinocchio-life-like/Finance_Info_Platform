import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import articleReducer from "./slices/articleSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedUser = persistReducer(persistConfig, userReducer);
const persistedArticle = persistReducer(persistConfig, articleReducer);

const store = configureStore({
  reducer: {
    user: persistedUser,
    article: persistedArticle,
    // add other reducers here
  },
});

export default store;
