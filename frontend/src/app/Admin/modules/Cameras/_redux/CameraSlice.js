import { createSlice } from "@reduxjs/toolkit";

const initialCameraState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
  cameraFetchedById: "",
  tableData: false
};

export const callTypes = {
  list: "list",
  action: "action"
};

export const CameraSlice = createSlice({
  name: "camera",
  initialState: initialCameraState,
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

    cameraFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload;
      state.totalCount = action.payload.length;
      state.tableData = true;
    },

    addNewCamera: (state, action) => {
      state.actionsLoading = false;
      state.entities.push(action.payload);
      state.error = null;
      state.tableData = true;
    },

    updatedExistingCamera: (state, action) => {
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

    cameraFetchedById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.cameraFetchedById = action.payload;
      state.tableData = true;
    },

    clearCameraById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.cameraFetchedById = null;
    }
  }
});
