import { createSlice } from "@reduxjs/toolkit";

const initialVfsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
  caseFetchedById: "",
  tableData: false
};

export const callTypes = {
  list: "list",
  action: "action"
};

export const VFSSlice = createSlice({
  name: "vfs",
  initialState: initialVfsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
        state.entities = [];
        state.tableData = false;
      } else {
        state.actionsLoading = false;
        state.entities = [];
        state.tableData = false;
      }
    },

    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    caseFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload;
      state.totalCount = action.payload.length;
      state.tableData = true;
    },

    addNewCase: (state, action) => {
      state.actionsLoading = false;
      state.entities.push(action.payload);
      state.error = null;
      state.tableData = true;
    },

    updatedExistingCase: (state, action) => {
      let data = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = state.entities.map(entity => {
        if (entity.id === data.id) {
          return data;
        }
        return entity;
      });
    },

    caseFetchedById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.caseFetchedById = action.payload;
      state.tableData = true;
    },

    clearCaseById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.caseFetchedById = null;
    },

    licenseDetail: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.licenseDetail = action.payload;
      state.totalCount = action.payload.length;
      state.tableData = true;
    },

  }
});
