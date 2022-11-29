import axios from 'axios';
import * as actions from '../api';

const api = store => next => async action => {
  if (action.type !== actions.apiCallBegan.type) {
    if (action.type === actions.inputChangeBegan.type) {
      store.dispatch({type: action.payload.onSuccess, payload: action.payload.data})
    }
    return next(action)
  }

  const {base, url, method, data, onStart, onSuccess, onError} = action.payload;
  const env = process.env.REACT_APP_ENVIRONMENT;

  console.log(`operating in ${env}`)

  if (onStart) store.dispatch({type: onStart});
  
  next(action)
  
  try {
    let baseURL;
    if (!base || base === 'fb') {
      baseURL = process.env.REACT_APP_APIURL ? `${process.env.REACT_APP_APIURL}/api/` : `http://localhost:9002/api/`
    }

    let response = await axios.request({
      baseURL: baseURL,
      url,
      method,
      data,
      headers: {'x-auth-token': localStorage.getItem('x-auth-token')}
    })

    // General
    store.dispatch(actions.apiCallSuccess(response.data))

    // Specific
    if (response.headers['x-auth-token']) {
      localStorage.setItem(`x-auth-token`, response.headers[`x-auth-token`]); 
    }
      
    if (onSuccess) {
      store.dispatch({type: onSuccess, payload: response.data});
    } 
    // if (onFollowUp) store.dispatch(onFollowUp.action)

  }
  catch (err) {
    // General
    store.dispatch(actions.apiCallFailed(err.message));

    // Specific
    if (onError) {
      store.dispatch({type: onError, payload: err?.response?.data || err.message});
    }
  }
}

export default api;