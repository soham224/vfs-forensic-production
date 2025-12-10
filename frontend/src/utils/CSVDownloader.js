import React from "react";
import * as PropTypes from "prop-types";
import downloadCSV from "json-to-csv-export";

export function CSVDownloader({ data = [], fields = {}, filename = "", className, buttonName }) {
    const handleDownload = () => {
        downloadCSV({ data, fields, filename });
    };

    return (
        <div className={className}>
            <button type="button" className="btn btn-primary" onClick={handleDownload}>
                {buttonName}
            </button>
        </div>
    );
}

CSVDownloader.propTypes = {
    data: PropTypes.array,
    fields: PropTypes.object,
    filename: PropTypes.string,
    className: PropTypes.string,
    buttonName: PropTypes.string,
};
