import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../actions';
import { useHttp } from "../../customHooks/http.hook";
import { filtersChanged, productDeleted } from "../../store/slice/productSlice";
import { Spiner } from '../spiner/Spiner';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from "./Product.module.scss";
import { ProductItem } from './productItem/ProductItem';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { ModalProduct } from '../modalProduct/ModalProduct';
import Stack from 'react-bootstrap/Stack';
import { createSelector } from 'reselect';

export const Product = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const sortedProducts = createSelector(
    (state) => state.product.activeFilter,
    (state) => state.product.products,
    (filter, products) => {
      let tempProducts = [];

      if (filter === "a-z") {
        return tempProducts = products.slice().sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      } else if (filter === "z-a") {
        return tempProducts = products.slice().sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      } else if (filter === "low-high" ) {
        return tempProducts = products.slice().sort((a, b) => {
          return a.count - b.count;
        })
    }
      else if (filter === "high-low") {
        return tempProducts = products.slice().sort((a, b) => {
          return b.count - a.count ;
        })
      }
});

  const sortedProductsSelector = useSelector(sortedProducts)

  const productsLoadingStatus = useSelector(state => state.product.productLoadingStatus);

  const activeFilterSelect = useSelector(state => state.product.activeFilter);

  const dispatch = useDispatch();
  const { request } = useHttp();



  const onDelete = useCallback((id) => {

    request(`http://localhost:3001/products/${id}`, "DELETE")
      .then(dispatch(productDeleted(id)))
      .catch(err => console.log(err));

  }, [request, dispatch]);


  useEffect(() => {
    dispatch(fetchProducts(request))

  }, [dispatch, request]);


  if (productsLoadingStatus === "loading") {
    return <Spiner className="spinner"/>;
  } else if (productsLoadingStatus === "error") {
    return <h5>Ошибка загрузки</h5>;
  }


  const renderProductsList = (arr) => {

    if (arr.length === 0) {
      return (
        <CSSTransition
          timeout={0}
          classNames={styles.product}>
          <h5>Продукты отсутствуют</h5>
        </CSSTransition>
      )
    }

    return arr.map(({ id, ...props }) => {


      return (
        <CSSTransition
          key={id}
          timeout={500}
          classNames={styles.product}>
          <ProductItem  {...props} id={id} onDelete={() => onDelete(id)} />
        </CSSTransition>
      )
    })
  }



  const elements = renderProductsList(sortedProductsSelector);


  return (
    <>
      <Container style={{ marginTop: "20px" }} className="text-center">
        <Stack direction="horizontal" gap={3} className="d-flex justify-content-center">
          <Button variant="outline-primary" onClick={handleShow}>Add Product</Button>
          <Form.Select style={{ maxWidth: "180px" }} aria-label="Default select example" value={activeFilterSelect} onChange={(e) => dispatch(filtersChanged(e.target.value))}>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
            <option value="low-high">Low-High</option>
            <option value="high-low">High-Low</option>
          </Form.Select>
        </Stack>
        {show && <ModalProduct show={show} onHide={handleClose} />}
        <TransitionGroup component="div" >
          <div className={styles.wrapper}>
            {elements}
          </div>
        </TransitionGroup>
      </Container>
    </>
  )
}
