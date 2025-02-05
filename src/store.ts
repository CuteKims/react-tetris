import { configureStore } from '@reduxjs/toolkit'
import matrixReducer from './reducers/matrixSlice'
import dispatcherReducer from './reducers/dispatcherSlice'

export const store = configureStore({
    reducer: {
        matrix: matrixReducer,
        dispatcher: dispatcherReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch