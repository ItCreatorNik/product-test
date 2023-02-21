import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    productDetails: {},
    productDetailsLoadingStatus: 'idle',
}

const productSlice = createSlice({
    name: "productDetails",
    initialState,
    reducers: {
        productDetailsFetching: state => { state.productDetailsLoadingStatus = 'loading' },
        productDetailsFetched: (state, action) => {
            state.productDetailsLoadingStatus = 'idle';
            state.productDetails = action.payload;
        },
        productDetailsFetchingError: state => {
            state.productDetailsLoadingStatus = 'error';
        },
        productUpdateDetails: (state,action) => {
            state.productDetails = action.payload
        },
        productUpdateComments: (state,action) => {
            state.productDetails.comments.push(action.payload)
        }
    }
});

export const { productDetailsFetching, productDetailsFetched, productDetailsFetchingError, updateProductDetails, productUpdateDetails, productUpdateComments } = productSlice.actions

export default productSlice.reducer