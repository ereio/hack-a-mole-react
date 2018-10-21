
import { Thunk } from 'redux-testkit';
import * as actions from './actions';
import * as types from './actions';

describe('user actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('reports logging in user and sets current user on success', async () => {  
    const dispatches = await Thunk(actions.loginUser).execute();
    expect(dispatches.length).toBe(2);
    expect(dispatches[0].isPlainObject()).toBe(true);
    expect(dispatches[0].getAction()).toEqual({
      type: types.LOGIN, 
    });

    expect(dispatches[1].isPlainObject()).toBe(true);
    expect(dispatches[1].getAction()).toEqual({
      type: types.LOGIN_SUCCESS, user: {
        name: "Joe Test",
        highscore: 0,
      }
    });
  });
})

