import { CloseOutlined } from "@mui/icons-material";
import APIs from "apis";
import images from "assets";
import axios from "axios";
import CustomButton from "components/CustomButton";
import CustomModal from "components/CustomModal";
import TextInput from "components/TextInput";
import { useFormik } from "formik";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { IUserLogin, loginUser } from "stores/userSlice";
import * as Yup from "yup";

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isUsernameFocus, setIsUsernameFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [isInitialized, setIsInitialized] = useState(false);
  const enqueueSnackbar = useEnqueueSnackbar();

  // MODAL
  const [isPopupResetRequestOpen, setIsPopupResetRequestOpen] = useState(false);
  const [isPopupResetConfirmOpen, setIsPopupResetConfirmOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();

  const handleOpenPopupResetRequestModal = () => {
    setIsPopupResetRequestOpen(true);
  };

  const handleClosePopupResetRequestModal = () => {
    setIsPopupResetRequestOpen(false);
    formikRequestResetPassword.resetForm();
  };

  const handleOpenPopupResetConfirmModal = () => {
    setIsPopupResetConfirmOpen(true);
  };

  const handleClosePopupResetConfirmModal = () => {
    setIsPopupResetConfirmOpen(false);
    formikConfirmResetPassword.resetForm();
  };

  const handleLoginUser = async (userData: IUserLogin) => {
    const resultAction = await dispatch(loginUser(userData));
    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      console.log("USER:", user);
      // const notification = {
      //   id: Math.floor(Math.random() * 101 + 1),
      //   title: 'Thành công',
      //   description: 'Đăng nhập thành công!',
      //   backgroundColor: 'text-green-100',
      //   icon: images.toast.check,
      // };
      // dispatch(uiActions.showNotifications(notification));
      enqueueSnackbar("Đăng nhập thành công!", {
        variant: "success",
      });
      navigate("/");
    } else {
      console.log(resultAction);
      if (typeof resultAction.payload !== "string") {
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
          : "Đăng nhập tài khoản thất bại";
        enqueueSnackbar(`${errorMessage}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Đăng nhập tài khoản thất bại`, {
          variant: "error",
        });
      }
    }
  };

  // const handleVerifyRegisterEmail = useCallback(
  //   (registerKey: string) => {
  //     const request: RegistrationVerifyRequest = {
  //       key: registerKey,
  //     };
  //     console.log('request:', request);
  //     axios
  //       .post(APIs.registrationVerify, request)
  //       .then((res) => {
  //         console.log(res);
  //         enqueueSnackbar('Xác nhận email thành công', { variant: 'success' });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         if (err.response && err.response.data) {
  //           enqueueSnackbar(`${err.response.data.detail}`, {
  //             variant: 'error',
  //           });
  //         } else {
  //           enqueueSnackbar(`Xác nhận email thất bại`, { variant: 'error' });
  //         }
  //       });
  //   },
  //   [enqueueSnackbar]
  // );

  const handleChangePassword = useCallback(() => {}, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Vui lòng nhập user name bot")
        .matches(
          /^[a-zA-Z][_-a-zA-Z0-9@.]{5,19}$/gi,
          "User name bot phải từ 6 đến 20 ký tự, bắt đầu bằng chữ và không chứa ký tự đặc biệt"
        ),
      password: Yup.string()
        .min(6, "Mật khẩu của bạn phải dài ít nhất 6 ký tự")
        .max(20, "Mật khẩu của bạn không được quá 20 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const userLogin = {
          username: values.username,
          password: values.password,
        };
        handleLoginUser(userLogin);
      } catch (err) {}
    },
  });

  const formikRequestResetPassword = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không đúng, vui lòng nhập lại")
        .max(50, "Email không thể vượt quá 50 ký tự")
        .required("Vui lòng nhập email"),
    }),
    onSubmit: async (values, helpers) => {
      const request = {
        email: values.email,
      };
      axios
        .post(APIs.resetPasswordRequest, request)
        .then((res) => {
          console.log(res);
          handleClosePopupResetRequestModal();
          enqueueSnackbar("Gửi yêu cầu thành công", { variant: "success" });
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar("Gửi yêu cầu thất bại", { variant: "error" });
        });
    },
  });

  const formikConfirmResetPassword = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
      uid: "",
      resetKey: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu của bạn phải dài ít nhất 6 ký tự")
        .max(20, "Mật khẩu của bạn không được quá 20 ký tự"),
      confirmNewPassword: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu của bạn phải dài ít nhất 6 ký tự")
        .max(20, "Mật khẩu của bạn không được quá 20 ký tự")
        .oneOf([Yup.ref("newPassword"), null], "Mật khẩu phải khớp"),
    }),
    onSubmit: async (values, helpers) => {
      const request = {
        new_password1: values.newPassword,
        new_password2: values.confirmNewPassword,
        uid: values.uid,
        token: values.resetKey,
      };
      console.log(request);
      axios
        .post(`${APIs.resetPasswordConfirm}`, request)
        .then((res) => {
          handleClosePopupResetConfirmModal();
          enqueueSnackbar("Cập nhập mật khẩu thành công", {
            variant: "success",
          });
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar("Cập nhập mật khẩu thất bại", { variant: "error" });
        });
    },
  });

  const handlePasswordShown = () => {
    setIsPasswordShown((prev) => !prev);
  };

  const handleClick = () => {
    enqueueSnackbar("User created", { variant: "success" });
  };

  // CHECK IS LOGGED IN -> REDIRECT TO HOME
  useEffect(() => {
    if (isLoggedIn && isInitialized) navigate("/");
    setIsInitialized(true);
  }, [isLoggedIn, navigate, isInitialized]);

  // CHECK REDIRECT SEARCH PARAMS
  useEffect(() => {
    console.log(params);
    // const queryParams = new URLSearchParams(window.location.search);
    if (!isInitialized) {
      setIsInitialized(true);
    }
    if (isInitialized && location.pathname.includes("verify-email")) {
      // const registerKey = queryParams.get('register_key');
      // !!registerKey && handleVerifyRegisterEmail(registerKey);
      enqueueSnackbar("Xác nhận email thành công", { variant: "success" });
      navigate("/login", { replace: true });
    } else if (isInitialized && params.uid && params.reset_key) {
      console.log(params);
      const uid = params.uid;
      const resetKey = params.reset_key;
      formikConfirmResetPassword.setFieldValue("uid", uid);
      formikConfirmResetPassword.setFieldValue("resetKey", resetKey);
      handleOpenPopupResetConfirmModal();
    }
  }, [enqueueSnackbar, isInitialized, location.pathname, navigate, params]);

  const handleSubmitButton = () => {
    formikConfirmResetPassword.handleSubmit();
  };

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Login</title>
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
            Đăng nhập
          </h1>

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
            // helperTextEnd={`${formik.values.username.length}/20`}
            containerClassName="mb-4"
          />

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
            // helperTextEnd={`${formik.values.password.length}/20`}
            icon={images.input.eye}
            containerClassName="mb-4"
          />

          <div className="flex justify-end mb-8">
            <button
              onClick={() => {
                handleOpenPopupResetRequestModal();
              }}
              className="text-transparent cursor-pointer bg-primary-100 bg-clip-text"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            className="w-full p-4 mb-8 text-center bg-primary-100 rounded-2xl"
            onClick={() => formik.handleSubmit()}
          >
            <p className="font-semibold text-transparent bg-background-100 bg-clip-text">
              Đăng nhập
            </p>
          </button>

          <div className="text-center">
            <p>
              Chưa có tài khoản{" "}
              <Link
                className="text-transparent bg-primary-100 bg-clip-text"
                to="/register"
              >
                Đăng ký
              </Link>{" "}
              tại đây
            </p>
          </div>
        </div>
      </div>

      {/* MODAL SUBMIT EMAIL RESET PASSWORD */}
      <CustomModal
        isOpen={isPopupResetRequestOpen}
        handleOpen={handleOpenPopupResetRequestModal}
        handleClose={handleClosePopupResetRequestModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-ink-10">
            <h3 className="text-xl font-semibold text-ink-100">
              Quên mật khẩu
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleClosePopupResetRequestModal}
            />
          </div>
          <div className="flex flex-col px-6 pt-6 pb-8">
            <p className="mb-6 text-ink-80">
              Vui lòng nhập email đăng nhập tài khoản
            </p>
            <TextInput
              id="email"
              name="email"
              label="email"
              type="email"
              fullWidth
              isLabelOutside
              value={formikRequestResetPassword.values.email}
              onChange={formikRequestResetPassword.handleChange}
              onBlur={formikRequestResetPassword.handleBlur}
              error={
                formikRequestResetPassword.touched.email &&
                Boolean(formikRequestResetPassword.errors.email)
              }
              helperText={
                formikRequestResetPassword.touched.email &&
                formikRequestResetPassword.errors.email
              }
              helperTextEnd={`${formikRequestResetPassword.values.email.length}/50`}
              containerClassName="mb-12"
            />
            <div className="items-center justify-center gap-4">
              <CustomButton
                className="w-full py-4"
                textClassName="font-bold"
                onClick={() => {
                  formikRequestResetPassword.handleSubmit();
                }}
              >
                Tiếp tục
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* MODAL RESET PASSWORD CONFIRM */}
      <CustomModal
        isOpen={isPopupResetConfirmOpen}
        handleOpen={handleOpenPopupResetConfirmModal}
        handleClose={handleClosePopupResetConfirmModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-ink-10">
            <h3 className="text-xl font-semibold text-ink-100">
              Đặt lại mật khẩu
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleClosePopupResetConfirmModal}
            />
          </div>
          <div className="flex flex-col px-6 pt-6 pb-8">
            <p className="mb-6 text-ink-80">
              Vui lòng cài đặt mật khẩu truy cập tài khoản
            </p>
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              label="mật khẩu mới"
              fullWidth
              isLabelOutside
              value={formikConfirmResetPassword.values.newPassword}
              onChange={formikConfirmResetPassword.handleChange}
              onBlur={formikConfirmResetPassword.handleBlur}
              error={
                formikConfirmResetPassword.touched.newPassword &&
                Boolean(formikConfirmResetPassword.errors.newPassword)
              }
              helperText={
                formikConfirmResetPassword.touched.newPassword &&
                formikConfirmResetPassword.errors.newPassword
              }
              helperTextEnd={`${formikConfirmResetPassword.values.newPassword.length}/20`}
              icon={images.input.eye}
              containerClassName="mb-6"
            />
            <TextInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              label="mật khẩu mới"
              fullWidth
              isLabelOutside
              value={formikConfirmResetPassword.values.confirmNewPassword}
              onChange={formikConfirmResetPassword.handleChange}
              onBlur={formikConfirmResetPassword.handleBlur}
              error={
                formikConfirmResetPassword.touched.confirmNewPassword &&
                Boolean(formikConfirmResetPassword.errors.confirmNewPassword)
              }
              helperText={
                formikConfirmResetPassword.touched.confirmNewPassword &&
                formikConfirmResetPassword.errors.confirmNewPassword
              }
              helperTextEnd={`${formikConfirmResetPassword.values.confirmNewPassword.length}/20`}
              icon={images.input.eye}
              containerClassName="mb-12"
            />
            <div className="items-center justify-center gap-4">
              <CustomButton
                className="w-full py-4"
                textClassName="font-bold"
                type="submit"
                onClick={handleSubmitButton}
              >
                Xác nhận
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Login;
