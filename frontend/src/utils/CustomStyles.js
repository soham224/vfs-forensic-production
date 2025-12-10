export const customStyles = {
    option: (styles, state) => ({
        ...styles,
        cursor: "pointer"
    }),
    control: styles => ({
        ...styles,
        cursor: "pointer"
    })
};
// export const customStyles = {
//     control: (provided, state) => ({
//         ...provided,
//         backgroundColor: "#fff", // Background color of the select box
//         borderColor: state.isFocused ? "#147b82" : "#ccc", // Border color on focus
//         boxShadow: state.isFocused ? "0 0 0 2px rgba(20, 123, 130, 0.5)" : "none",
//         cursor: "pointer"
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         backgroundColor: state.isSelected ? "#147b82" : state.isFocused ? "#ddd" : "#fff", // Change selected option color
//         color: state.isSelected ? "white" : "black", // Text color for selected option
//         cursor: "pointer",
//     }),
// };
