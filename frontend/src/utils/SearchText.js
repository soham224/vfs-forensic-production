import React from "react";
import * as PropTypes from "prop-types";

export function SearchText(props) {
  let { onChangeHandler, reference } = props;
  return (
    <div className=''>
      <input
        // style={{ width: "auto" }}
        type="search"
        className="form-control"
        name="searchText"
        placeholder="Search For Name"
        onChange={onChangeHandler}
        ref={reference}
      />
    </div>
  );
}

SearchText.propTypes = {
  onChangeHandler: PropTypes.func,
  reference: PropTypes.object,
  className: PropTypes.string,
};
