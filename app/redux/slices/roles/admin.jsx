import { createSlice } from '@reduxjs/toolkit'

const adminSlice = createSlice({
  name: 'data',
  initialState: {
    admin: false,
  },

  reducers: {
    addAdmintoLocal: (state) => {
      if (state.admin == false) {
        state.admin = true
      } else {
      }
    },
  },
})

export const adminReducer = adminSlice.reducer

export const { addAdmintoLocal } = adminSlice.actions
