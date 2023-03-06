import { createSlice } from '@reduxjs/toolkit'

const peopleSlice = createSlice({
  name: 'data',
  initialState: {
    people: false,
  },

  reducers: {
    addPeopletoLocal: (state) => {
      if (state.people == false) {
        state.people = true
      } else {
      }
    },
  },
})

export const peopleReducer = peopleSlice.reducer

export const { addPeopletoLocal } = peopleSlice.actions
