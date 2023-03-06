import { createSlice } from '@reduxjs/toolkit';

const userInfoSlice = createSlice({
  name: 'info',
  initialState: {
    info: []
},
  reducers: {
    // setUser: (state, action) => {
    //   return action.payload;
    // },
    setUser: (state, action) => {
          state.info.push({ ...action.payload})
      },
    clearUser: (state) => null,
  },
});

export const userInfoReducer = userInfoSlice.reducer

export const { setUser, clearUser } = userInfoSlice.actions;