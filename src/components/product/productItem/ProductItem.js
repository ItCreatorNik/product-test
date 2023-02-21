import React from 'react'
import { Card, Button, Col} from "react-bootstrap";
import { RxTrash } from "react-icons/rx"
import Notiflix from "notiflix";
import { Link } from 'react-router-dom';
import styles from './ProductItem.module.scss'
// import { Link } from "react-router-dom";

export const ProductItem = ({ id, name, count, imageUrl, onDelete, size, weight }) => {


  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      "Confirmation",
      "You are about to delete this product",
      "Delete",
      "Cancel",
      function okCb() {
        onDelete(id);
      },
      function cancelCb() {
        console.log("Delete Canceled");
      },
      {
        width: "350px",
        borderRadius: "3px",
        titleColor: "black",
        okButtonBackground: "red",
        cssAnimationStyle: "zoom",
      }
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__img}>
        <img src={imageUrl} />
      </div>
      <div className={styles.card__content}>
        <div className={styles.card__name}>{name.toUpperCase()}</div>
        <div className={styles.card__description}>Count: {count}</div>
        <div className={styles.card__description}>Width : {size?.width} </div>
        <div className={styles.card__description}>Height : {size?.height} </div>
        <div className={styles.card__description}>Weight : {weight} </div>
        <div className={styles.card__buttons}>
          <Link to={`/product-details/${id}`}>
            <Button variant="primary">Check Details</Button>
          </Link>
          <RxTrash size={35} color="red" onClick={() => confirmDelete(id)} className="align-self-end cursor-poiner" />
        </div>
      </div>
    </div>
  );
};


