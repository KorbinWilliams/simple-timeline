import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './apiTools';
import _ from 'lodash';

const slice = createSlice({
  name: 'chartInfo',
  initialState: {},
  reducers: {
    // setAirline: (state, action) => {
    //   state.airline = action.payload
    // },
  }
})

// NOTE // reducers used in requests
const { } = slice.actions
// NOTE // exported requests
export const { } = slice.actions;

export default slice.reducer;

// export const loadUsers = () => (dispatch, getState) => {
//   const url = `users/all`

//   return dispatch(
//     apiCallBegan({
//       url,
//       method: 'get',
//       onSuccess: getUsersSuccess.type,
//       onError: getUsersError.type,
//     })
//   )
// }