import React, { cloneElement } from 'react';
import { Grid, Modal } from '@mui/material'

const ItemModal = (props) => {
  // NOTE // modal: {toggle: modalToggle, modalItem: modalItem, component: itemModal, modalProps: modalProps, setToggle: toggleModal, setItem: setModalItem}
  let modal = props.modal
  let modalToggle = modal.toggle
  let item = modal.modalItem

  if (modal.component) {
    return (
      <Modal 
      open={modalToggle}
      onClose={() => {modal.setToggle(false)}}
      aria-labelledby="item-modal"
      aria-describedby="modal to display an item"
      >
        <Grid container alignContent="center" justify="center" item xs={12} style={{marginTop: '15%'}}>
          {cloneElement(modal.component, { modal: modal, item: item.item })}
        </Grid>
      </Modal>
    )
  }
  else {
    return <div></div>
  }
}

export default ItemModal