import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { useHttp } from '../../../customHooks/http.hook';
import { productDetailsFetched, productDetailsFetching, productDetailsFetchingError, productUpdateDetails, productUpdateComments } from '../../../store/slice/productDetailsSlice';
import { Spiner } from '../../spiner/Spiner';
import styles from "./ProductDetails.module.scss";
import { v4 as uuidv4 } from 'uuid';
import { RxTrash } from "react-icons/rx"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ModalProduct } from '../../modalProduct/ModalProduct';



export const ProductDetails = () => {


  const { id } = useParams();

  const dispatch = useDispatch();

  const { request } = useHttp();

  const [show, setShow] = useState(false);
  const [edit,setEdit] = useState(false)

  const handleClose = () => {
    setShow(false);
    // setEdit(false)
  }
  const handleShow = () => {
    setEdit(true);
    setShow(true);
    
  }


  const [comment, setComment] = useState({
    id: uuidv4() ,
    description: "",
    date: Date(),
    productId: id,
  });



  const productDetails = useSelector(state => state.productDetails.productDetails)

  const productsLoadingStatus = useSelector(state => state.productDetails.productDetailsLoadingStatus)



  useEffect(() => {
    dispatch(productDetailsFetching());
    request(`http://localhost:3001/products/${id}`)
      .then(data => dispatch(productDetailsFetched(data)))
      .catch(() => dispatch(productDetailsFetchingError()))
  }, [request, dispatch]);




  const updateProduct = (data) => {
    request(`http://localhost:3001/products/${id}`, "PUT",  JSON.stringify(data)
    ).then(res => dispatch(productUpdateDetails(res)));

  };


  const deleteComment = (com) => {
    let updatedDetails = {
      ...productDetails,
      comments: productDetails.comments.filter((item) => item.id !== com.id),
    };

    updateProduct(updatedDetails)
  }

  const addComment = (data) => {

    if (!data.description) {
      return ;
    }
    

    const updatedProdCom = { ...productDetails, comments: [...productDetails.comments, data]};

    dispatch(productUpdateComments(data));
    updateProduct(updatedProdCom);
    setComment({
      id: uuidv4(),
      description: "",
      date: Date(),
      productId: id,
    })
  }


  if (productsLoadingStatus === "loading") {
    return <Spiner className="spinner" />;
  } else if (productsLoadingStatus === "error") {
    return <h5>Ошибка загрузки</h5>;
  }

  return (
    <>
      {edit && <ModalProduct show={show} onHide={handleClose} edit={edit} />}
    <section className={styles["section-details"]}>
      <div className='container'>
          <h2 className={styles.details__title}>Product Details</h2>
          <Button variant="outline-primary"  onClick={handleShow}>Edit Product</Button>
        <div className={styles.details__wrapper}>
          <div className={styles.details__img}>
            <img src={productDetails.imageUrl} />
          </div>
          <div className={styles.details__content}>
            <h3 className={styles.details__name}>{productDetails.name}</h3>
            <div className={styles.details__description}>Quantity of goods : {productDetails.count}</div>
            <div className={styles.details__description}>Width : {productDetails.size?.width} </div>
            <div className={styles.details__description}>Height : {productDetails.size?.height} </div>
            <div className={styles.details__description}>Weight : {productDetails.weight} </div>
            <div className={styles.comments}>
              <h3>Comments:</h3>
              {productDetails.comments?.map((com, i) => {
                return (
                  <div key={com.id} className={styles.comments__wrappper}>
                    <div><span className={styles.comments__number}>№{i + 1}:</span> <span className={styles.comments__description}>{com.description}</span></div>
                    <RxTrash size={30} color="red" className="align-self-end cursor-poiner" onClick={() => deleteComment(com)}/>
                  </div>
                )
              })}
            </div>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Add your comment"
                name="comment"
                type="text"
                value={comment.description}
                onChange={(e) => {
                  setComment({ ...comment, description: e.target.value });
                }}
              />
              <Button variant="outline-primary" id="button-addon2" 
                onClick={() => addComment(comment)}>
                Add
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
