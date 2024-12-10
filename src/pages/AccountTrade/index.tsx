import React, { useCallback, useEffect, useState } from 'react';
import AccountTradeGuide from './AccountTradeGuide';
import images from 'assets';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';
import AccountTradeTable from './AccountTradeTable';
import axios from 'axios';
import APIs from 'apis';
import BotData from 'types/BotData';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import { useMediaQuery } from 'react-responsive';

interface AccountTradeFailResponse {
  Failed?: string;
}

const AccountTrade = () => {
  const [isApiKeyType, setIsApiKeyType] = useState(false);
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isApiKeyFocus, setIsApiKeyFocus] = useState(false);
  const [isEmailPasswordDisabled, setIsEmailPasswordDisabled] = useState(true);
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isMediumDesktop = useMediaQuery({
    query: '(min-width: 1024px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const handlePasswordShown = () => {
    setIsPasswordShown((prev) => !prev);
  };

  const fetchAllBots = useCallback(() => {
    axios
        .get(APIs.partnerAccount)
        .then((res) => {
          const data = res.data;
          setPartnerBotDatas(data);
        })
        .catch((err) => {
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thất bại',
          //   description: 'Không thể lấy bot data',
          //   backgroundColor: 'text-red-100',
          //   icon: images.toast.error,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar('Không thể lấy bot data!', { variant: 'error' });
        });
  }, [enqueueSnackbar]);

  const formikEmailPassword = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
          .email('Email không đúng, vui lòng nhập lại')
          .required('Vui lòng nhập email'),
      password: Yup.string().max(20).required('Vui lòng nhập mật khẩu'),
    }),
    validateOnChange: false,
    onSubmit: async (values, helpers) => {
      try {
        const userLogin = {
          botname: 'string',
          password: values.password,
          botusername: values.email,
          description: 'string',
          status: 'active',
        };
        axios
            .post(APIs.partnerAccount, userLogin)
            .then((res) => {
              console.log(res);
              // const notification = {
              //   id: Math.floor(Math.random() * 101 + 1),
              //   title: 'Thành công',
              //   description: 'Liên kết tài khoản thành công!',
              //   backgroundColor: 'text-green-100',
              //   icon: images.toast.check,
              // };
              // dispatch(uiActions.showNotifications(notification));
              enqueueSnackbar('Liên kết tài khoản thành công!', {
                variant: 'success',
              });
              fetchAllBots();
              helpers.resetForm();
            })
            .catch((err) => {
              if (err.response && err.response.data) {
                const errData = err.response.data as AccountTradeFailResponse;
                // const notification = {
                //   id: Math.floor(Math.random() * 101 + 1),
                //   title: 'Thất bại',
                //   description: `${
                //     errData.Failed
                //       ? errData.Failed
                //       : 'Liên kết tài khoản thất bại'
                //   }`,
                //   backgroundColor: 'text-red-100',
                //   icon: images.toast.error,
                // };
                // dispatch(uiActions.showNotifications(notification));
                enqueueSnackbar(
                    `${
                        errData.Failed
                            ? errData.Failed
                            : 'Liên kết tài khoản thất bại'
                    }`,
                    { variant: 'error' }
                );
              } else {
                // const notification = {
                //   id: Math.floor(Math.random() * 101 + 1),
                //   title: 'Thất bại',
                //   description: `${
                //     err.data
                //       ? JSON.stringify(err.data)
                //       : 'Liên kết tài khoản thất bại'
                //   }`,
                //   backgroundColor: 'text-red-100',
                //   icon: images.toast.error,
                // };
                // dispatch(uiActions.showNotifications(notification));
                enqueueSnackbar(
                    `${
                        err.data
                            ? JSON.stringify(err.data)
                            : 'Liên kết tài khoản thất bại'
                    }`,
                    { variant: 'error' }
                );
              }
            });
      } catch (err) {}
    },
  });

  const formikApiKey = useFormik({
    initialValues: {
      apiKey: '',
    },
    validationSchema: Yup.object({
      apiKey: Yup.string().required('API Key không đúng, vui lòng nhập lại'),
    }),
    validateOnChange: false,
    onSubmit: async (values, helpers) => {
      try {
        const apiKeyDto = {
          botname: 'string',
          usertoken: values.apiKey,
          botusername: 'string',
          description: 'string',
          status: 'active',
        };
        axios
            .post(APIs.partnerAccount, apiKeyDto)
            .then((res) => {
              console.log(res);
              // const notification = {
              //   id: Math.floor(Math.random() * 101 + 1),
              //   title: 'Thành công',
              //   description: 'Liên kết tài khoản thành công!',
              //   backgroundColor: 'text-green-100',
              //   icon: images.toast.check,
              // };
              // dispatch(uiActions.showNotifications(notification));
              enqueueSnackbar('Liên kết tài khoản thành công!', {
                variant: 'success',
              });
              fetchAllBots();
              helpers.resetForm();
            })
            .catch((err) => {
              if (err.response && err.response.data) {
                const errData = err.response.data as AccountTradeFailResponse;
                // const notification = {
                //   id: Math.floor(Math.random() * 101 + 1),
                //   title: 'Thất bại',
                //   description: `${
                //     errData.Failed
                //       ? errData.Failed
                //       : 'Liên kết tài khoản thất bại'
                //   }`,
                //   backgroundColor: 'text-red-100',
                //   icon: images.toast.error,
                // };
                // dispatch(uiActions.showNotifications(notification));
                enqueueSnackbar(
                    `${
                        errData.Failed
                            ? errData.Failed
                            : 'Liên kết tài khoản thất bại'
                    }`,
                    { variant: 'error' }
                );
              } else {
                // const notification = {
                //   id: Math.floor(Math.random() * 101 + 1),
                //   title: 'Thất bại',
                //   description: `${
                //     err.data
                //       ? JSON.stringify(err.data)
                //       : 'Liên kết tài khoản thất bại'
                //   }`,
                //   backgroundColor: 'text-red-100',
                //   icon: images.toast.error,
                // };
                // dispatch(uiActions.showNotifications(notification));
                enqueueSnackbar(
                    `${
                        err.data
                            ? JSON.stringify(err.data)
                            : 'Liên kết tài khoản thất bại'
                    }`,
                    { variant: 'error' }
                );
              }
            });
      } catch (err) {}
    },
  });

  useEffect(() => {
    fetchAllBots();
  }, [fetchAllBots]);

  return (
      <>
        <AccountTradeGuide />
        <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6`}>
          <div className="bg-background-80 rounded-3xl h-fit">
            <h2 className="px-6 py-5 border-b border-ink-10 text-ink-100 text-xl font-bold">
              Thêm mới tài khoản giao dịch
            </h2>
            <div className="p-6 flex flex-col">
              {/* Register */}
              <div className="mb-6 p-4 bg-ink-05 rounded-xl flex flex-col">
                <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex gap-x-5 text-ink-100/80">
                    <img
                        className="w-[3.5rem]"
                        src={images.home.gold_wallet}
                        alt="Legend Group"
                    />
                    <div>
                      <p className="pb-2">Sàn giao dịch</p>
                      <img
                          className="w-[7.8125rem]"
                          src={images.home.fibo_win}
                          alt="Legend Group"
                      />
                    </div>
                  </div>
                  <a
                      className="flex-grow md:flex-initial"
                      href="https://lambotrade.net/"
                      target="_blank"
                      rel="noreferrer"
                  >
                    <button className="px-6 py-3 bg-primary-100 rounded-xl w-full md:w-auto">
                    <span className="bg-background-100 bg-clip-text text-transparent font-bold">
                      Đăng ký
                    </span>
                    </button>
                  </a>
                </div>
                <p className="text-sm text-ink-80">
                  Nếu bạn chưa có tài khoản sản sàn Lambotrade vui lòng ấn vào nút
                  đăng ký tài khoản bên trên
                </p>
              </div>

              <div className="mb-8">
                <p className="mb-4 text-ink-100 text-sm">HÌNH THỨC LIÊN KẾT</p>

                {/* RADIO */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <div
                      className={`flex items-center gap-x-[0.625rem] rounded-xl p-4 cursor-pointer ${
                          !isApiKeyType
                              ? 'border-primary-z-0 bg-primary-10'
                              : 'bg-ink-05'
                      } `}
                      onClick={() => {
                        setIsApiKeyType(false);
                      }}
                  >
                    <input
                        className="cursor-pointer"
                        type="radio"
                        checked={!isApiKeyType}
                        onClick={() => {
                          setIsApiKeyType(false);
                        }}
                    />
                    <label className={`text-ink-100 cursor-pointer`}>
                      Email/Mật khẩu
                    </label>
                  </div>
                  {/*
                  <div
                      className={`flex items-center gap-x-[0.625rem] rounded-xl p-4 cursor-pointer ${
                          isApiKeyType
                              ? 'border-primary-z-0 bg-primary-10'
                              : 'bg-ink-05'
                      }`}
                      onClick={() => {
                        setIsApiKeyType(true);
                      }}
                  >
                    <input
                        className="cursor-pointer"
                        type="radio"
                        checked={isApiKeyType}
                        onClick={() => {
                          setIsApiKeyType(true);
                        }}
                    />
                    <label className={`text-ink-100 cursor-pointer`}>
                      API Key
                    </label>
                  </div>
                  */}
                </div>
                {!isApiKeyType && (
                    <>
                      {/* EMAIL */}
                      <div className="mb-4 text-ink-100">
                        <div
                            className={`relative border-primary-input ${
                                isEmailFocus && !formikEmailPassword.errors.email
                                    ? 'border-primary-focus'
                                    : ''
                            }`}
                        >
                          <input
                              id="email"
                              name="email"
                              className={`${
                                  formikEmailPassword.values.email || isEmailFocus
                                      ? 'pt-5 pb-3'
                                      : 'py-4'
                              } px-3 w-full bg-ink-10 rounded-2xl text-ink-100 ${
                                  formikEmailPassword.errors.email
                                      ? 'border border-red-100'
                                      : ''
                              }`}
                              type="text"
                              value={formikEmailPassword.values.email}
                              onChange={formikEmailPassword.handleChange}
                              onBlur={(e) => {
                                formikEmailPassword.handleBlur(e);
                                setIsEmailFocus((prev) => !prev);
                              }}
                              onFocus={(e) => {
                                console.log(e);
                                setIsEmailFocus((prev) => !prev);
                              }}
                          />
                          <label
                              className={`absolute left-0 transition-all ${
                                  formikEmailPassword.values.email || isEmailFocus
                                      ? 'text-xs px-3 py-[0.375rem]'
                                      : 'px-3 py-4'
                              } text-ink-40`}
                          >
                            Email đăng nhập sàn
                          </label>
                        </div>
                        {formikEmailPassword.errors.email && (
                            <p className="px-4 pt-1 text-red-100 text-sm">
                              {formikEmailPassword.errors.email}
                            </p>
                        )}
                      </div>
                      {/* PASSWORD */}
                      <div
                          className={`relative border-primary-input ${
                              isPasswordFocus &&
                              !formikEmailPassword.errors.password &&
                              formikEmailPassword.touched.password
                                  ? 'border-primary-focus'
                                  : ''
                          }`}
                      >
                        <input
                            id="password"
                            name="password"
                            className={`${
                                formikEmailPassword.values.password || isPasswordFocus
                                    ? 'pt-5 pb-3'
                                    : 'py-4'
                            } px-3 w-full bg-ink-10 rounded-2xl ${
                                formikEmailPassword.errors.password
                                    ? 'border border-red-100'
                                    : ''
                            }`}
                            type="text"
                            value={formikEmailPassword.values.password}
                            onChange={formikEmailPassword.handleChange}
                            onBlur={(e) => {
                              formikEmailPassword.handleBlur(e);
                              setIsPasswordFocus((prev) => !prev);
                            }}
                            onFocus={(e) => {
                              console.log(e);
                              setIsPasswordFocus((prev) => !prev);
                            }}
                        />
                        <label
                            className={`absolute left-0 transition-all ${
                                formikEmailPassword.values.password || isPasswordFocus
                                    ? 'text-xs px-3 py-[0.375rem]'
                                    : 'px-3 py-4'
                            } text-ink-40`}
                        >
                          Mật khẩu
                        </label>
                        <img
                            className="w-[1.5rem] absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer"
                            src={images.login.eye}
                            alt="Legend Group"
                            onClick={handlePasswordShown}
                        />
                      </div>
                      <div className="px-4 pt-1 flex justify-between">
                        {formikEmailPassword.errors.password &&
                            formikEmailPassword.touched.password && (
                                <p className="text-red-100 text-sm">
                                  {formikEmailPassword.errors.password}
                                </p>
                            )}
                      </div>
                    </>
                )}

                {isApiKeyType && (
                    <>
                      <div className="text-ink-100">
                        <div
                            className={`relative border-primary-input ${
                                isApiKeyFocus && !formikApiKey.errors.apiKey
                                    ? 'border-primary-focus'
                                    : ''
                            }`}
                        >
                          <input
                              id="apiKey"
                              name="apiKey"
                              className={`${
                                  formikApiKey.values.apiKey || isApiKeyFocus
                                      ? 'pt-5 pb-3'
                                      : 'py-4'
                              } px-3 w-full bg-ink-10 rounded-2xl text-ink-100 ${
                                  formikApiKey.errors.apiKey
                                      ? 'border border-red-100'
                                      : ''
                              }`}
                              type="text"
                              value={formikApiKey.values.apiKey}
                              onChange={formikApiKey.handleChange}
                              onBlur={(e) => {
                                formikApiKey.handleBlur(e);
                                setIsApiKeyFocus((prev) => !prev);
                              }}
                              onFocus={(e) => {
                                console.log(e);
                                setIsApiKeyFocus((prev) => !prev);
                              }}
                          />
                          <label
                              className={`absolute left-0 transition-all ${
                                  formikApiKey.values.apiKey || isApiKeyFocus
                                      ? 'text-xs px-3 py-[0.375rem]'
                                      : 'px-3 py-4'
                              } text-ink-40`}
                          >
                            API key
                          </label>
                        </div>
                        {formikApiKey.errors.apiKey && (
                            <p className="px-4 pt-1 text-red-100 text-sm">
                              {formikApiKey.errors.apiKey}
                            </p>
                        )}
                      </div>
                    </>
                )}
              </div>

              {!isApiKeyType && (
                  <button
                      className="p-4 bg-primary-100 w-full rounded-2xl text-center"
                      onClick={() => {
                        formikEmailPassword.handleSubmit();
                      }}
                      //disabled={isEmailPasswordDisabled}
                  >
                    <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
                      Liên kết tài khoản
                    </p>
                  </button>
              )}

              {isApiKeyType && (
                  <button
                      className="p-4 bg-primary-100 w-full rounded-2xl text-center"
                      onClick={() => {
                        formikApiKey.handleSubmit();
                      }}
                  >
                    <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
                      Liên kết tài khoản
                    </p>
                  </button>
              )}
            </div>
          </div>

          <div className="xl:col-span-2">
            <AccountTradeTable
                fetchAllBots={fetchAllBots}
                partnerBotDatas={partnerBotDatas}
            />
          </div>
        </div>
      </>
  );
};

export default AccountTrade;
