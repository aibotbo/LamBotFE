import {
  CaseReducer,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import APIs from 'apis';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BotBalance } from 'types/BotBalance';
import BotData from 'types/BotData';
import InputSelectOption from 'types/InputSelectOption';
import useSetAxiosWithBearer from 'utils/SetAxiosWithBearer';

const INITIAL_BOT_BALANCE = {
  balance: 1,
  demo_balance: 1,
  usdt_balance: 1,
};

const INITIAL_SELECT_OPTIONS: InputSelectOption[] = [
  {
    value: '',
    label: '',
  },
];

const INITIAL_SELECTED_OPTION: InputSelectOption = {
  value: '',
  label: '',
};

const INITIAL_SELECTED_ACCOUNT_TYPE_OPTION: InputSelectOption = {
  value: 'DEMO',
  label: 'Tài khoản DEMO',
};

export interface IUserState {
  user: UserData;
  isLoggedIn: boolean;
  partnerBotDatas: BotData[];
  botBalance: BotBalance;
  selectedAccountType: InputSelectOption;
  selectedBotAccount: InputSelectOption;
  accountOptions: InputSelectOption[];
}

export interface UserData {
  pk: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AxiosErrorRegisterLogin {
  username?: string[];
  email?: string[];
  password1?: string[];
  non_field_errors?: string[];
}

export interface IUserRegistration {
  email: string;
  username: string;
  password1: string;
  password2: string;
}

export interface IUserLogin {
  username?: string;
  email?: string;
  password: string;
}

export interface IUserLoginSuccessResponse {
  access_token: string;
  refresh_token: string;
  user: UserData;
}

export interface IUserRegisterSuccessResponse {
  detail: string;
}

const initialState: IUserState = {
  user: {
    pk: 0,
    username: 'Lucas',
    email: 'lucas@gmail.com',
    first_name: 'Lucas',
    last_name: 'Lucas',
  },
  isLoggedIn: false,
  partnerBotDatas: [],
  botBalance: INITIAL_BOT_BALANCE,
  selectedAccountType: INITIAL_SELECTED_ACCOUNT_TYPE_OPTION,
  selectedBotAccount: INITIAL_SELECTED_OPTION,
  accountOptions: INITIAL_SELECT_OPTIONS,
};

const updateUser: CaseReducer<IUserState, PayloadAction<UserData>> = (
  state,
  action
) => {
  state.user = action.payload;
};

const updateIsLoggedIn: CaseReducer<IUserState, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isLoggedIn = action.payload;
};

const updatePartnerBotDatas: CaseReducer<
  IUserState,
  PayloadAction<BotData[]>
> = (state, action) => {
  state.partnerBotDatas = [...action.payload];
};

const updateBotBalance: CaseReducer<IUserState, PayloadAction<BotBalance>> = (
  state,
  action
) => {
  state.botBalance = { ...action.payload };
};

const updateSelectedAccountType: CaseReducer<
  IUserState,
  PayloadAction<InputSelectOption>
> = (state, action) => {
  state.selectedAccountType = { ...action.payload };
};

const updateSelectedBotAccount: CaseReducer<
  IUserState,
  PayloadAction<InputSelectOption>
> = (state, action) => {
  state.selectedBotAccount = { ...action.payload };
};

const updateAccountOptions: CaseReducer<
  IUserState,
  PayloadAction<InputSelectOption[]>
> = (state, action) => {
  state.accountOptions = [...action.payload];
};

const resetUser = () => initialState;

export const registerUser = createAsyncThunk<
  IUserRegisterSuccessResponse,
  IUserRegistration,
  {
    extra?: {
      jwt?: string;
    };
    rejectValue: AxiosErrorRegisterLogin | string;
  }
>(
  'auth/registration/',
  async (userRegistration: IUserRegistration, thunkApi) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFTOKEN':
          //   'AUU8RqDrltgIlPCnhJRPO8Ff8dCR1jNWi1bsRlaOjrHEuoZwlDp5JCrbIBAjlwX1',
        },
      };
      const response = await axios.post(
        `${APIs.registration}`,
        userRegistration,
        config
      );
      return response.data;
    } catch (error) {
      // return custom error message from backend if present
      const err = error as AxiosError<AxiosErrorRegisterLogin>;
      console.log(err);
      if (err.response && err.response.data) {
        return thunkApi.rejectWithValue(err.response.data);
      } else {
        console.log(err.response);
        return thunkApi.rejectWithValue('Đăng ký tài khoản thất bại');
      }
    }
  }
);

export const loginUser = createAsyncThunk<
  IUserLoginSuccessResponse,
  IUserLogin,
  {
    extra?: {
      jwt?: string;
    };
    rejectValue: AxiosErrorRegisterLogin | string;
  }
>('auth/login/', async (userLogin: IUserLogin, thunkApi) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN':
          'AUU8RqDrltgIlPCnhJRPO8Ff8dCR1jNWi1bsRlaOjrHEuoZwlDp5JCrbIBAjlwX1',
      },
    };
    const response = await axios.post(`${APIs.login}`, userLogin, config);
    return response.data;
  } catch (error) {
    // return custom error message from backend if present
    const err = error as AxiosError<AxiosErrorRegisterLogin>;
    console.log(err);
    if (err.response && err.response.data) {
      const errData = err.response.data as AxiosErrorRegisterLogin;
      return thunkApi.rejectWithValue(errData);
    } else {
      console.log(err.response);
      return thunkApi.rejectWithValue('Đăng nhập tài khoản thất bại');
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser,
    updateIsLoggedIn,
    updatePartnerBotDatas,
    updateBotBalance,
    updateSelectedAccountType,
    updateSelectedBotAccount,
    updateAccountOptions,
    resetUser,
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      const payload = action.payload;
      console.log('registerUser.fulfilled payload: ', payload);
      // localStorage.setItem('accessToken', payload.access_token);
      // localStorage.setItem('refreshToken', payload.refresh_token);
      // useSetAxiosWithBearer(payload.access_token);
      // state.user = payload.user;
      // state.isLoggedIn = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      console.log('registerUser.rejected payload: ', action.payload);
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const payload = action.payload;
      localStorage.setItem('userData', JSON.stringify(payload.user));
      localStorage.setItem('accessToken', payload.access_token);
      localStorage.setItem('refreshToken', payload.refresh_token);
      useSetAxiosWithBearer(payload.access_token);
      state.user = payload.user;
      state.isLoggedIn = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.log('Thất bại LOGIN');
      if (action.payload) {
        console.log(action.payload);
      }
      console.log(action.payload);
      console.log(action);
    });
  },
});

export const userActions = userSlice.actions;

export default userSlice;
