import React from 'react';
import {Button, Modal} from "react-bootstrap";
import Select from "react-select";
import * as actions from "../../_redux/VFSAction";
import {useDispatch} from "react-redux";
import {fetchCase} from "../../_redux/VFSAction";
function CaseStatusModal({show ,selectedCaseStatusDetails ,onHide ,pageNo, pageSize}) {
    const dispatch = useDispatch();
    const [seletedCaseStatus, setSeletedCaseStatus] = React.useState(null);

    const handleChangeCase = (value) => {
        setSeletedCaseStatus(value)
    }

    const onSubmit = () => {
        const data = {
            "id": selectedCaseStatusDetails.id ,
            "case_status": seletedCaseStatus.value
        }
        dispatch(actions.updateCase(data))
            .then((response) => {
                const data = {
                    "page_number": pageNo,
                    "page_size": pageSize
                }
                dispatch(fetchCase(data));
                onHide()
            })
            .catch((error) => {
                console.error("Error updating case status:", error);
            })

    }

    return (
        <>
            <Modal size="sm" centered scrollable={true} show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Change Case Status
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{height: '150px'}}>
                    <Select
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            cursor: "pointer",
                            colors: {
                                ...theme.colors,
                                primary25: "#5DBFC4",
                                primary: "#147b82",
                            },
                        })}
                        isMulti={false}
                        placeholder="Case Status"
                        options={CaseOptions}
                        onChange={handleChangeCase}
                        // styles={customStyles}
                        value={seletedCaseStatus}
                    />



                </Modal.Body>
                <Modal.Footer style={{ width: '100%' , display: 'block'}}>
                    <div className="d-flex justify-content-between">
                        <div>
                        <Button variant="primary" onClick={onHide}>Close</Button>
                        </div>
                        <Button variant="secondary" onClick={onSubmit}>Submit</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CaseStatusModal;

const CaseOptions = [
    {value: 'OPEN', label: 'OPEN'},
    {value: 'CLOSED', label: 'CLOSE'},
]