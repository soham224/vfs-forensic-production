import React, { Component } from "react";
import { PropTypes } from "prop-types";
import objectAssign from "object-assign";
import { mystyle } from "./style"; // Make sure this is the correct path for your style

export class Region extends Component {
  renderHandles() {
    return (
        <div>
          <div data-dir="se" style={mystyle.RegionHandleSE} />
          <div data-dir="sw" style={mystyle.RegionHandleSW} />
          <div data-dir="nw" style={mystyle.RegionHandleNW} />
          <div data-dir="ne" style={mystyle.RegionHandleNE} />
        </div>
    );
  }

  render() {
    // Destructure the props for cleaner access
    const { x, y, width, height, data, customStyle, onCropStart, onClick, handles, dataRenderer, changing, index } = this.props;

    // Check if 'regionStyle' is defined in the 'data' prop, otherwise use an empty object
    const regionStyle = data?.regionStyle || {};

    // Define localStyle
    const localStyle = {
      width: `${width}%`,
      height: `${height}%`,
      left: `${x}%`,
      top: `${y}%`
    };

    // Prepare dataRenderArgs for rendering the custom data renderer
    const dataRenderArgs = {
      data,
      isChanging: changing,
      index
    };

    return (
        <div
            style={objectAssign(
                {},
                mystyle.Region,
                localStyle,
                customStyle,
                regionStyle // Apply regionStyle from data prop
            )}
            onMouseDown={onCropStart}
            onTouchStart={onCropStart}
            data-wrapper="wrapper"
            onClick={onClick}
        >
          {handles ? this.renderHandles() : null}
          {dataRenderer ? dataRenderer(dataRenderArgs) : null}
        </div>
    );
  }
}

// Prop validation
Region.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onCropStart: PropTypes.func.isRequired,
  handles: PropTypes.bool,
  changing: PropTypes.bool,
  dataRenderer: PropTypes.func,
  data: PropTypes.shape({
    regionStyle: PropTypes.object // Ensure regionStyle is an object or undefined
  }),
  customStyle: PropTypes.object,
  onClick: PropTypes.func
};

Region.defaultProps = {
  handles: false,
  changing: false,
  dataRenderer: null,
  data: {},
  customStyle: {},
  onClick: () => {}
};

// Module export (if needed)
// module.exports = Region;
