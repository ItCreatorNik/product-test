import { useEffect, useState } from 'react';
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../customHooks/http.hook';
import { productUpdateDetails} from '../../store/slice/productDetailsSlice';
import { productAdded } from '../../store/slice/productSlice';
import {fetchProducts} from "../../actions";
const initialState = {
    name: "",
    count: 0,
    imageUrl: "",
    size: {
        width: 0,
        height: 0,
    },
    weight: "",
    comments: [],
};

export const ModalProduct = ({ show, onHide, edit }) => {
    const {id} = useParams();

    const dispatch = useDispatch();
    const { request } = useHttp();

    const [editedProduct, setEditedProduct] = useState({});

    const [product, setProduct] = useState(initialState);

    const [nameDirty, setNameDirty] = useState(false);
    const [countDirty, setCountDirty] = useState(false);
    const [imageUrlDirty, setImageUrlDirty] = useState(false);
    const [sizeWDirty, setSizeWDirty] = useState(false);
    const [sizeHDirty, setSizeHDirty] = useState(false);
    const [weightDirty, setWeightDirty] = useState(false);


    const [errorValid, setErrorValid] = useState("");
    const [countError, setCountError] = useState("");
    const [imageUrlError, setImageUrlError] = useState("");
    const [sizeWError, setSizeWError] = useState("");
    const [sizeHError, setSizeHError] = useState("");
    const [weightError, setWeightError] = useState("");

    const [validForm, setValidForm] = useState(false)



    const blurHandler = (e) => {
        switch (e.target.name) {
            case "name":
                setNameDirty(true)
                break
            case "count":
                setCountDirty(true)
                break
            case "imageUrl":
                setImageUrlDirty(true)
                break
            case "width":
                setSizeWDirty(true)
                break
            case "height":
                setSizeHDirty(true)
                break
            case "weight":
                setWeightDirty(true)
                break
        }
    }


    const fieldHandler = (e, setState) => {
        const name = e.target.name;
        const value = e.target.value;
        setProduct({ ...product, [name]: value });
        value === 0 || value.trim() === ""
            ? setState("Field cannot be empty")
            : setState("");
    };




    const handleSizeWChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProduct({ ...product, size: { ...product.size, [name]: Number(value) } });
        if (value === 0 || value === "") {
            setSizeWError("Field cannot be empty");
        } else {
            setSizeWError("")
        }
    }

    const handleSizeHChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProduct({ ...product, size: { ...product.size, [name]: Number(value) } });
        if (value === 0 || value === "") {
            setSizeHError("Field cannot be empty");
        } else {
            setSizeHError("")
        }
    }

    const resetForm = (e) => {
        e.preventDefault();

        if(!edit) {
            setProduct({
                ...product,
                name: "",
                count: 0,
                imageUrl: "",
                size: {
                    width: 0,
                    height: 0,
                },
                weight: "",
                comments: [],
            });
        }
        onHide()
    }

    const addProduct = (e) => {
        e.preventDefault();


        const newProduct = {
            id: uuidv4(),
            count: product.count,
            name: product.name,
            imageUrl: product.imageUrl,
            size: {
                width: Number(product.size.width),
                height: Number(product.size.height),
            },
            weight: product.weight,
            comments: [],
        }


        request("http://localhost:3001/products", "POST", JSON.stringify(newProduct))
            .then(dispatch(productAdded(newProduct)))
            .catch(err => console.log(err));

        onHide();
        setProduct(initialState);
    }

    const editProduct = (e) => {
        e.preventDefault();

        const newEditProduct = {
            ...product,
            count: product.count,
            name: product.name,
            imageUrl: product.imageUrl,
            size: {
                width: Number(product.size.width),
                height: Number(product.size.height),
            },
            weight: product.weight,
        }

        request(`http://localhost:3001/products/${id}`, "PUT", JSON.stringify(newEditProduct))
            .then(dispatch(productUpdateDetails(newEditProduct)))
            .catch(err => console.log(err));

        onHide()
    };

    const onSubmit = (e) => {
        if(edit) {
            editProduct(e)
        } else {
            addProduct(e)

        }
    }

    useEffect(() => {
        if (edit) {
            setProduct(() => ({ ...editProduct }))
        }

    }, []);

    useEffect(() => {
        request(`http://localhost:3001/products/${id}`)
            .then(data => setProduct(data))
            .catch((err) => console.log(err))
    }, [request, dispatch,id]);

    useEffect(() => {
        if (errorValid || countError || imageUrlError || sizeWError || sizeHError || weightError) {

            setValidForm(false)
        } else {
            setValidForm(true)
        }

    }, [errorValid, countError, imageUrlError, sizeWError, sizeHError, weightError]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="product-name">Product name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    id="product-name"
                    onBlur={e => blurHandler(e)}
                    value={product.name}
                    onChange={(e) => fieldHandler(e, setErrorValid)}
                />
                {(nameDirty && errorValid) && <div style={{ color: "red" }}>{errorValid}</div>}
                <Form.Label htmlFor="product-count">Product count</Form.Label>
                <Form.Control
                    type="number"
                    name='count'
                    id="product-count"
                    onBlur={e => blurHandler(e)}
                    value={product.count}
                    onChange={(e) => fieldHandler(e, setCountError)}
                />
                {(countDirty && countError) && <div style={{ color: "red" }}>{countError}</div>}
                <Form.Label htmlFor="product-image">imageUrl:"some url here"</Form.Label>
                <Form.Control
                    type="text"
                    name="imageUrl"
                    id="product-image"
                    value={product.imageUrl}
                    onChange={(e) => fieldHandler(e, setImageUrlError)}
                    onBlur={e => blurHandler(e)}
                />
                {(imageUrlDirty && imageUrlError) && <div style={{ color: "red" }}>{imageUrlError}</div>}
                <Form.Label htmlFor="product-width">Product width</Form.Label>

                <Form.Control
                    type="number"
                    id="product-width"
                    name="width"
                    value={product.size?.width}
                    onChange={handleSizeWChange}
                    onBlur={e => blurHandler(e)}
                />
                {(sizeWDirty && sizeWError) && <div style={{ color: "red" }}>{sizeWError}</div>}
                <Form.Label htmlFor="product-height">Product height</Form.Label>
                <Form.Control
                    type="number"
                    name="height"
                    id="product-height"
                    value={product.size?.height}
                    onChange={handleSizeHChange}
                    onBlur={e => blurHandler(e)}
                />
                {(sizeHDirty && sizeHError) && <div style={{ color: "red" }}>{sizeHError}</div>}
                <Form.Label htmlFor="product-weight">Product weight</Form.Label>
                <Form.Control
                    type="text"
                    id="product-weight"
                    name="weight"
                    value={product.weight}
                    onChange={(e) => fieldHandler(e, setWeightError)}
                    onBlur={e => blurHandler(e)}
                />
                {(weightDirty && weightError) && <div style={{ color: "red" }}>{weightError}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="lg" onClick={resetForm}>
                    Cancel
                </Button>
                <Button disabled={!validForm} variant="primary" size="lg" onClick={onSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}



