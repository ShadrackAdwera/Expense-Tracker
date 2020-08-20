import React from 'react';

import classes from './Modal.css';

import Backdrop from '../backdrop/Backdrop';

import Aux from '../../../hoc/Aux'

const modal = (props) => {
  return (
    <Aux>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0',
        }}
      >
        {props.children}
      </div>
    </Aux>
  );
};
export default React.memo(
  modal,
  (prevProps, nextProp) =>
    nextProp.show === prevProps.show && nextProp.children === prevProps.children
);