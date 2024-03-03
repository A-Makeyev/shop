import { createSlice } from '@reduxjs/toolkit'


const localUserInfo = localStorage.getItem('userInfo')
const initialState = {
    userInfo: localUserInfo ? JSON.parse(localUserInfo) : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout: (state, action) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        }
    }
})

export default authSlice.reducer
export const { setCredentials, logout } = authSlice.actions