import { Reducer } from 'redux-testkit';
import Immutable from 'seamless-immutable';

import user from './reducer';
import * as types from './actions';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  isNameAvailable: false,
  current: {},
  errors: []
};


describe('user reducer', () => {
  it('should have initial state', () => {
    expect(user()).toEqual(initialState);
  });

  it('initial user creation should only affect isloading in state', () => {
    const isLoadingState = {
      ...initialState,
      isLoading: true,
    }
    Reducer(user).expect({ type: types.CREATE_USER }).toReturnState(isLoadingState);
  });

  it('if username is available it should set isNameAvailable', () => {
    const action = { type: types.CHECK_USER_EXISTS_SUCCESS };

    const userIsAvailable = { isNameAvailable: true };
    Reducer(user).expect(action).toReturnState({ ...initialState, ...userIsAvailable });
  });

  it('login should set authenticated and the current user', () => {
    const existingState = Immutable({ ...initialState, isNameAvailable: true });
    const user ={
      name: "Joe Test",
      highscore: 0,
    }
    const authenticatedUser = {
      current: user,
      isAuthenticated: true,
      isNameAvailable: false,
    };
    const action = { type: types.LOGIN_SUCCESS, user };
    Reducer(user).withState(existingState).expect(action).toReturnState({ ...initialState, ...authenticatedUser });
  });
});