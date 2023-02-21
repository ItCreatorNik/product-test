import Spinner from 'react-bootstrap/Spinner';
import React from 'react'


export const Spiner = () => {
  return (
      <Spinner animation="border" role="status" className="spinner">
          <span className="visually-hidden">Loading...</span>
      </Spinner> )
}
