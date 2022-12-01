import { combineReducers } from '@reduxjs/toolkit';
import chartInfo from './chartInfo';

export default combineReducers({
  chartInfo: chartInfo,
})