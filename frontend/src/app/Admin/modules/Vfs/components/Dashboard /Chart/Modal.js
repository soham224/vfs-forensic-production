import React from 'react';

function Modal({show , onHide}) {
    return (
        <>
            <Modal
                size="xl"
                centered
                scrollable={true}
                show={show}
                onHide={onHide}
                aria-labelledby="case-details-modal-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="case-details-modal-title">Case Details</Modal.Title>
                </Modal.Header>
            </Modal>
        </>
    );
}

export default Modal;