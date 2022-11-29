import { createSlice} from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
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

export const loadUsers = () => (dispatch, getState) => {
  const url = `users/all`

  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      onSuccess: getUsersSuccess.type,
      onError: getUsersError.type,
    })
  )
}

export const addUser = (user) => (dispatch, getState) => {
  const url = `users`

  return dispatch(
    apiCallBegan({
      url,
      method: 'post',
      data: user,
      onStart: adminReqStart.type,
      onSuccess: adminReqSuccess.type,
      onError: adminReqError.type,
    })
  )
}

export const editUser = (user) => (dispatch, getState) => {
  const url = `users/edit`

  return dispatch(
    apiCallBegan({
      url,
      method: 'post',
      data: user,
      onStart: adminReqStart.type,
      onSuccess: adminReqSuccess.type,
      onError: adminReqError.type,
    })
  )
}

export const deleteUser = (user) => (dispatch, getState) => {
  const url = `users/delete`

  return dispatch(
    apiCallBegan({
      url,
      method: 'post',
      data: user,
      onStart: adminReqStart.type,
      onSuccess: adminReqSuccess.type,
      onError: adminReqError.type,
    })
  )
}