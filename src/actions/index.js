import { productsFetching, productsFetched, productsFetchingError } from "../store/slice/productSlice";


export const fetchProducts = (request) => (dispatch) => {
    dispatch(productsFetching());
    request("http://localhost:3001/products")
        .then(data => dispatch(productsFetched(data)))
        .catch(() => dispatch(productsFetchingError()))
}












