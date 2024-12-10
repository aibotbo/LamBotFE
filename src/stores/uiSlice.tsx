import {
  CaseReducer,
  PayloadAction,
  createSlice,
  current,
} from '@reduxjs/toolkit';

interface INotification {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  icon: string;
}

interface INotifications extends Array<INotification> {}

interface IUIState {
  notifications: INotifications;
  autoDeleteNotification: number;
  isLoading: boolean;
  isModalOpen: boolean;
  isMobileSidebarOpen: boolean;
}

const initialState: IUIState = {
  notifications: [],
  autoDeleteNotification: 5000,
  isLoading: false,
  isModalOpen: false,
  isMobileSidebarOpen: false,
};

const updateIsLoading: CaseReducer<IUIState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isLoading = action.payload;
};

const updateIsModalOpen: CaseReducer<IUIState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isModalOpen = action.payload;
};

const updateIsMobileSidebarOpen: CaseReducer<IUIState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isMobileSidebarOpen = action.payload;
};

const showNotifications: CaseReducer<IUIState, PayloadAction<INotification>> = (
  state,
  action
) => {
  const currentState = current(state);
  state.notifications = [...currentState.notifications, action.payload];
};

const updateNotifications: CaseReducer<
  IUIState,
  PayloadAction<INotifications>
> = (state, action) => {
  state.notifications = [...action.payload];
};

const deleteNotifications: CaseReducer<IUIState, PayloadAction<any>> = (
  state,
  action
) => {
  state.notifications = [];
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotifications,
    updateNotifications,
    deleteNotifications,
    updateIsLoading,
    updateIsModalOpen,
    updateIsMobileSidebarOpen
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
