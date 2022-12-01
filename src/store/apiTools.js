import {createAction} from '@reduxjs/toolkit';

export const apiCallBegan = createAction('api/callBegan');
export const apiCallSuccess = createAction('api/callSuccess');
export const apiCallFailed = createAction('api/callFailed');
export const inputChangeBegan = createAction('api/inputChangeBegan');
export const inputChangeReceived = createAction('api/inputChangeReceived');