import React, { FC } from 'react';
import { SnackbarContent, SnackbarKey, SnackbarMessage } from 'notistack';
import images from 'assets';
import { Cancel } from '@mui/icons-material';

const ICONS = {
  success: images.toast.check,
  warning: images.toast.warning,
  error: images.toast.error,
};

const TEXT_COLORS = {
  success: 'text-green-100',
  warning: 'text-yellow-100',
  error: 'text-red-100',
};

const TITLES = {
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Thất bại',
};

interface CustomSnackbarProps {
  id: SnackbarKey;
  message: SnackbarMessage;
  variant?: 'success' | 'error' | 'warning';
  closeSnackBar: () => void;
}

const CustomSnackbar = React.forwardRef<HTMLDivElement, CustomSnackbarProps>(
  ({ id, message, variant, closeSnackBar }, ref) => {
    return (
      <>
        <div
          className={`flex items-center justify-between gap-x-3 p-4 rounded-3xl w-[full] md:w-[25rem] transition-all bg-dropdown toast-in-right`}
          key={id}
          ref={ref}
        >
          <div className="flex items-center justify-between gap-x-3">
            <div className="flex-shrink-0 p-[0.625rem] rounded-2xl bg-ink-05">
              <img
                className="w-8"
                src={variant && ICONS[variant]}
                alt="BotLambotrade"
              />
            </div>
            <div>
              <p
                className={`mb-1 font-bold ${variant && TEXT_COLORS[variant]}`}
              >
                {variant && TITLES[variant]}
              </p>
              <p className="text-ink-80 text-sm">{message}</p>
            </div>
          </div>
          <button onClick={closeSnackBar}>
            <Cancel className="fill-ink-100" />
          </button>
        </div>
      </>
    );
  }
);

export default CustomSnackbar;
