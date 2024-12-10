import React, { useEffect, useState } from 'react';
import images from 'assets';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IUserRegistration, registerUser, userActions } from 'stores/userSlice';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';
import Toast from 'components/Toast';
import { Helmet } from 'react-helmet-async';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import TextInput from 'components/TextInput';
import { useMediaQuery } from 'react-responsive';
import CustomModal from 'components/CustomModal';
import { CloseOutlined } from '@mui/icons-material';
import CustomButton from 'components/CustomButton';

const Register = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isUsernameFocus, setIsUsernameFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const isTablet = useMediaQuery({
    query: '(max-width: 1024px)',
  });

  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [isInitialized, setIsInitialized] = useState(false);

  // MODAL
  const [isEmailConfirmModalOpen, setIsUpsertZoomTableOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  // FUNCTIONS FOR MODAL
  const handleOpenEmailConfirmModal = () => {
    setIsUpsertZoomTableOpen(true);
  };

  const handleCloseEmailConfirmModal = () => {
    setIsUpsertZoomTableOpen(false);
  };

  const handleRegisterUser = async (userData: IUserRegistration) => {
    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
       const user = resultAction.payload;
       console.log('USER:', user);
       enqueueSnackbar(`Tạo tài khoản thành công!`, {
         variant: 'success',
       });
       enqueueSnackbar(`${resultAction.payload.detail}`, {
        variant: 'success',
       });
       navigate('/login');
      //handleOpenEmailConfirmModal();
    } else {
      if (typeof resultAction.payload !== 'string') {
        const usernameErrors = resultAction.payload?.username;
        const emailErrors = resultAction.payload?.email;
        const password1Errors = resultAction.payload?.password1;
        const non_field_errors = resultAction.payload?.non_field_errors;
        const errorMessage = usernameErrors
          ? usernameErrors[0]
          : emailErrors
          ? emailErrors[0]
          : password1Errors
          ? password1Errors[0]
          : non_field_errors
          ? non_field_errors[0]
          : 'Đăng ký tài khoản thất bại';
        // const notification = {
        //   id: Math.floor(Math.random() * 101 + 1),
        //   title: 'Thất bại',
        //   description: `${errorMessage}`,
        //   backgroundColor: 'text-red-100',
        //   icon: images.toast.error,
        // };
        // dispatch(uiActions.showNotifications(notification));
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        });
      } else {
        // const notification = {
        //   id: Math.floor(Math.random() * 101 + 1),
        //   title: 'Thất bại',
        //   description: `${resultAction.payload}`,
        //   backgroundColor: 'text-red-100',
        //   icon: images.toast.error,
        // };
        // dispatch(uiActions.showNotifications(notification));
        enqueueSnackbar(`${resultAction.payload}`, {
          variant: 'error',
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email không đúng, vui lòng nhập lại')
        .max(50, 'Email không thể vượt quá 50 ký tự')
        .required('Vui lòng nhập email'),
      username: Yup.string()
        .required('Vui lòng nhập user name bot')
        .matches(
          /^[a-zA-Z][_-a-zA-Z0-9]{5,19}$/gi,
          'User name bot phải từ 6 đến 20 ký tự, bắt đầu bằng chữ và không chứa ký tự đặc biệt'
        ),
      password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu của bạn phải dài ít nhất 6 ký tự')
        .max(20, 'Mật khẩu của bạn không được quá 20 ký tự'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const userRegistration = {
          email: values.email,
          username: values.username,
          password1: values.password,
          password2: values.password,
        };
        await handleRegisterUser(userRegistration);
      } catch (err) {
        console.log('register.tsx 66', err);
      }
    },
  });

  const handlePasswordShown = () => {
    setIsPasswordShown((prev) => !prev);
  };

  useEffect(() => {
    if (isLoggedIn && isInitialized) navigate('/');
    setIsInitialized(true);
  }, [isLoggedIn, navigate, isInitialized]);

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Register</title>
      </Helmet>
      <div className="relative min-h-[100vh] w-full bg-login-mobile-background xl:bg-login-background bg-cover bg-no-repeat">
        {/* <img
          className={`absolute left-0 top-0 xl:object-cover w-full h-full`}
          // src={images.login.background_tet}
          srcSet={`${
            isMobile || isTablet
              ? images.login.mobile_background
              : images.login.background
          } 4x`}
          alt="BotLambotrade"
        /> */}

        <div
          className={`absolute xl:top-[19%] 2xl:top-[23%] xl:left-[17.2%] left-[50%] translate-x-[-50%] bottom-[1rem] xl:bottom-[unset] p-6 xl:p-0 xl:translate-x-0 w-[calc(100%-2rem)] md:w-[calc(100%-10rem)] xl:w-[28.875rem] bg-background-80 xl:bg-transparent rounded-3xl`}
        >
          <h1 className="mb-8 bg-primary-100 bg-clip-text text-transparent text-3.5xl font-semibold">
            Đăng ký tài khoản
          </h1>

          {/* EMAIL */}
          <TextInput
            id="email"
            name="email"
            label="email"
            type="email"
            fullWidth
            isLabelOutside
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            helperTextEnd={`${formik.values.email.length}/50`}
            containerClassName="mb-4"
          />

          {/* USERNAME */}
          <TextInput
            id="username"
            name="username"
            label="user name bot"
            type="username"
            fullWidth
            isLabelOutside
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            helperTextEnd={`${formik.values.username.length}/20`}
            containerClassName="mb-4"
          />

          {/* PASSWORD */}
          <TextInput
            id="password"
            name="password"
            type="password"
            label="mật khẩu"
            fullWidth
            isLabelOutside
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            helperTextEnd={`${formik.values.password.length}/20`}
            icon={images.input.eye}
            containerClassName="mb-4"
          />

          <button
            className="mb-8 p-4 bg-primary-100 w-full rounded-2xl text-center"
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
              Đăng ký
            </p>
          </button>

          <div className="text-center">
            <p>
              Đã có tài khoản{' '}
              <Link
                className="bg-primary-100 bg-clip-text text-transparent"
                to="/login"
              >
                Đăng nhập
              </Link>{' '}
              tại đây
            </p>
          </div>
        </div>
      </div>
      {/* <Toast /> */}

      {/* WAIT EMAIL CONFIRM Popup Modal */}
      <CustomModal
        isOpen={isEmailConfirmModalOpen}
        handleOpen={handleOpenEmailConfirmModal}
        handleClose={handleCloseEmailConfirmModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="p-6 border-b border-ink-10 flex justify-between items-center">
            <h3 className="text-xl text-ink-100 font-semibold">
              Xác thực Email
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseEmailConfirmModal}
            />
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-ink-80">Một liên kết được gửi tới Email:</p>
              <div>
                <Link
                  to="#"
                  onClick={(e) => {
                    window.location.href = 'mailto:' + formik.values.email;
                    e.preventDefault();
                  }}
                  className="underline-primary bg-primary-100 bg-clip-text text-transparent"
                >
                  {formik.values.email}
                </Link>
              </div>
              <p className="text-ink-80">
                Vui lòng vào Email xác thực để hoàn thành đăng ký
              </p>
            </div>

            {/* <CustomButton
              className="w-full py-4"
              background="bg-primary-05"
              textColor="bg-primary-100"
              textClassName="font-bold"
              iconClassName="animate-spin"
              icon={images.login.spinning}
            >
              Chờ xác thực
            </CustomButton> */}
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Register;
