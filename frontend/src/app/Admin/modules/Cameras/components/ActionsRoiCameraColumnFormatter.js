import React from "react";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../_metronic/_helpers";

export function ActionsSelectRoiCameraColumnFormatter(
    cellContent,
    row,
    rowIndex,
    { editCameraRoiBtnClick }
) {

    return (
        <>
            {/*eslint-disable-next-line*/}
            <a
                title="Roi For Camera"
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => editCameraRoiBtnClick(row.id)}
            >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
              title="Edit Roi Camera Details"
              src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
            </a>
        </>
    );
}
