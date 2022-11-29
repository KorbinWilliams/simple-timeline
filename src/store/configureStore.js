import { getDefaultMiddleware, configureStore } from 'react-redux';
import rootReducer from './combineReducer';
import api from './middleware/api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), api]
});