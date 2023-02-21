import { configureStore } from '@reduxjs/toolkit';
import product from "./slice/productSlice"
import productDetails from "./slice/productDetailsSlice"



export const store = configureStore({
    reducer: { product, productDetails },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
})
