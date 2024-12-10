import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter,
  useRoutes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import routes from 'routes';
import './styles/App.css';
import toggleDarkLight from 'utils/ToggleDarkLight';
import { Backdrop, Button, CircularProgress, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';
import { useCallback, useEffect } from 'react';
import parseJwt from 'utils/ParseJwt';
import setAxiosWithBearer from './utils/SetAxiosWithBearer';
import { UserData, userActions } from 'stores/userSlice';
import axios from 'axios';
import APIs from 'apis';
import CustomLoader from 'components/CustomLoader';
import GoldButton from 'components/GoldButton';
import CustomModal from 'components/CustomModal';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import CustomSnackbar from 'components/CustomSnackbar';
import { Cancel } from '@mui/icons-material';
import CustomSnackbarClose from 'components/CustomSnackbar/CustomSnackbarClose';
import { useMediaQuery } from 'react-responsive';

const REMOVE_ACCESS_TOKEN = '';

function App() {
  toggleDarkLight();
  const content = useRoutes(routes);
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const isModalOpen = useAppSelector((state) => state.ui.isModalOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const handleClosePopupModal = () => {
    dispatch(uiActions.updateIsModalOpen(false));
  };

  console.log(content, 'content')

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    if (accessToken) {
      try {
        const values = parseJwt(accessToken);
        if (Date.now() < values.exp * 1000) {
          setAxiosWithBearer(accessToken);
          dispatch(userActions.updateIsLoggedIn(true));
          console.log('updateIsLoggedIn');
        } else {
          localStorage.removeItem('accessToken');
          dispatch(userActions.updateIsLoggedIn(false));
          setAxiosWithBearer(REMOVE_ACCESS_TOKEN);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setAxiosWithBearer(REMOVE_ACCESS_TOKEN);
        navigate('/login');
      }
      // setAxiosWithBearer(
      //   'eyJhbGciOiJIUzI1NiIsImtpZCI6ImFyZXNiby5jb20iLCJ0eXAiOiJKV1QifQ.eyJ1aWQiOiIxNjY0MDU1Mjk0NjU1Iiwibmlja19uYW1lIjoidG9wdG9wMzMzIiwic3lzdGVtIjoiYXJlc2JvLXdlYiIsImFwaV9rZXlfcmVxdWVzdF9pZCI6ImMwNmIwNDQwLTY2MzItNDEwNC04OTUyLTM1ZjVjYWU2NTYzYSIsImFwaV9rZXlfY2xpZW50X2lkIjoiYm8tYXBpIiwic2l0ZV9uYW1lIjoiYXJlc2JvLmNvbSIsImV4cCI6MTY4MDExMjI3MywiaXNzIjoiYXJlc2JvLmNvbSIsImF1ZCI6ImFyZXNiby13ZWIifQ.-WYHJQWmL9AJvkl0bMd4YXsRuN7-TWbZf7TboIinSl8'
      // );
    }
    if (userData) {
      try {
        const userDataConverted = JSON.parse(userData) as UserData;
        dispatch(userActions.updateUser(userDataConverted));
      } catch (err) {
        console.log(err);
      }
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    axios.interceptors.request.use(
      (request) => {
        // Edit request config
        dispatch(uiActions.updateIsLoading(true));
        return request;
      },
      (err) => {
        console.log(err);
        return Promise.reject(err);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        // console.log(response);
        // Edit response config
        dispatch(uiActions.updateIsLoading(false));
        return response;
      },
      (err) => {
        console.log(err);
        // if (err.response.status === 401) {
        //   localStorage.removeItem('accessToken');
        //   localStorage.removeItem('refreshToken');
        //   localStorage.removeItem('userData');
        //   setAxiosWithBearer(REMOVE_ACCESS_TOKEN);
        //   if (!location.pathname.includes('register')) {
        //     navigate('/login');
        //   }
          // dispatch(userActions.resetUser());
        // } else {
          dispatch(uiActions.updateIsLoading(false));
        // }
        return Promise.reject(err);
      }
    );
  }, [dispatch, navigate]);

  useEffect(() => {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {content}
      <CustomLoader />

      <CustomModal isOpen={isModalOpen} handleClose={handleClosePopupModal}>
        <div
          className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 md:w-[31.25rem] w-[calc(100vw-2rem)] bg-background-80 rounded-3xl text-center`}
        >
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100 font-bold">
            Xin lỗi
          </h3>
          <p className="mb-8 mx-auto max-w-[18.75rem] text-ink-80">
            Tính năng đang phát triển, vui lòng đợi bản cập nhập sau
          </p>
          <div className="grid grid-cols-1 justify-center items-center gap-4">
            <GoldButton
              onClick={() => {
                handleClosePopupModal();
              }}
            >
              Xác nhận
            </GoldButton>
          </div>
        </div>
      </CustomModal>
    </SnackbarProvider>
  );
}

export default App;
