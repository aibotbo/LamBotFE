import React from 'react';
import { useMediaQuery } from 'react-responsive';

const AccountTradeGuide = () => {
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

  return (
    <div className="mb-6 px-4 py-8 rounded-3xl bg-background-80">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 1 */}
        <div className="relative flex items-center lg:flex-col gap-3">
          <div className="p-[0.375rem] border-primary-button font-bold">
            <div className="px-4 py-2 rounded-full bg-primary-100">
              <p className="bg-background-80 text-transparent bg-clip-text">
                1
              </p>
            </div>
          </div>
          <div className="max-w-[11.5rem] text-ink-100 lg:text-center">
            Tạo tài khoản sàn Lambotrade
          </div>
          {isMediumDesktop && (
            <hr className="absolute left-[70%] xl:left-[65%] top-[25%] translate-y-[-50%] w-[70%] xl:w-[75%] h-[1px] border-none bg-primary-20" />
          )}
          {!isMediumDesktop && (
            <div className="absolute left-[1.15rem] top-[calc(100%+0.75rem)] bg-primary-20 w-4 h-[1px] rotate-90"></div>
          )}
        </div>

        {/* 2 */}
        <div className="relative flex items-center lg:flex-col gap-3">
          <div className="p-[0.375rem] border-primary-button font-bold">
            <div className="px-4 py-2 rounded-full bg-primary-100">
              <p className="bg-background-80 text-transparent bg-clip-text">
                2
              </p>
            </div>
          </div>
          <div className="max-w-[11.5rem] text-ink-100 lg:text-center">
            Nhập Email và mật khẩu đăng nhập sàn Lambotrade
          </div>
          {isMediumDesktop && (
            <hr className="absolute left-[70%] xl:left-[65%] top-[25%] translate-y-[-50%] w-[70%] xl:w-[75%] h-[1px] border-none bg-primary-20" />
          )}
          {!isMediumDesktop && (
            <div className="absolute left-[1.15rem] top-[calc(100%+0.75rem)] bg-primary-20 w-4 h-[1px] rotate-90"></div>
          )}
        </div>

        {/* 3 */}
        <div className="relative flex items-center lg:flex-col gap-3">
          <div className="p-[0.375rem] border-primary-button font-bold">
            <div className="px-4 py-2 rounded-full bg-primary-100">
              <p className="bg-background-80 text-transparent bg-clip-text">
                3
              </p>
            </div>
          </div>
          <div className="max-w-[11.5rem] text-ink-100 lg:text-center">
            Nhập mã 2FA và mã xác nhận Email (nếu có)
          </div>
          {isMediumDesktop && (
            <hr className="absolute left-[70%] xl:left-[65%] top-[25%] translate-y-[-50%] w-[70%] xl:w-[75%] h-[1px] border-none bg-primary-20" />
          )}
          {!isMediumDesktop && (
            <div className="absolute left-[1.15rem] top-[calc(100%+0.75rem)] bg-primary-20 w-4 h-[1px] rotate-90"></div>
          )}
        </div>

        {/* 4 */}
        <div className="relative flex items-center lg:flex-col gap-3">
          <div className="p-[0.375rem] border-primary-button font-bold">
            <div className="px-4 py-2 rounded-full bg-primary-100">
              <p className="bg-background-80 text-transparent bg-clip-text">
                4
              </p>
            </div>
          </div>
          <div className="max-w-[11.5rem] text-ink-100 lg:text-center">
            Bấm Tiếp tục để hoàn tất liên kết tài khoản
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTradeGuide;
