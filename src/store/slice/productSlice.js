import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  productLoadingStatus: 'idle',
    activeFilter: "a-z"
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
      productsFetching: state => { state.productLoadingStatus = 'loading' },
      productsFetched: (state, action) => {
          state.productLoadingStatus = 'idle';
          state.products = action.payload;
      },
      productsFetchingError: state => {
          state.productLoadingStatus = 'error';
      },
      productAdded: (state, action) => {
          state.products.push(action.payload);
      },
      productDeleted: (state, action) => {
          state.products = state.products.filter(item => item.id !== action.payload);
      },
      filtersChanged: (state, action) => {
          state.activeFilter = action.payload;
      }
  }
});

export const { productsFetching, productsFetched, productsFetchingError, productAdded, productDeleted, filtersChanged, productEdited } = productSlice.actions

export default productSlice.reducer
