import {
  Box,
  OutlinedInputProps,
  TextField,
  TextFieldProps,
  styled,
} from '@mui/material';
import React, { FC, useState } from 'react';
import {
  DateRange,
  DateRangePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Dayjs } from 'dayjs';
import images from 'assets';
import InputRightArrowSvg from 'svgs/InputRightArrowSvg';
import InputDatePickerSeperatorSvg from 'svgs/InputDatePickerSeperatorSvg';

interface CustomDatePickerProps {
  calendars?: number;
  value: DateRange<Dayjs>;
  isOpen: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  helperTextEnd?: React.ReactNode;
  isInputDisabled?: boolean;
  handleToggleOpen: () => void;
  handleOnOpen: () => void;
  handleOnClose: () => void;
  onDateChange: (
    date: DateRange<Dayjs>,
    keyboardInputValue?: string | undefined
  ) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onMouseOver?: React.MouseEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onMouseLeave?: React.MouseEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}

// const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
//   border: 0,
//   background: 'white',
//   marginLeft: 8,
//   marginRight: 8,
//   width: 150,
// }));

// const StyledTextField = styled(TextField)({
//   '& label.Mui-focused': {
//     color: 'green',
//   },
//   '& .MuiInput-underline:after': {
//     borderBottomColor: 'green',
//   },
//   '& .MuiOutlinedInput-root': {
//     '& fieldset': {
//       borderColor: 'red',
//     },
//     '&:hover fieldset': {
//       borderColor: 'yellow',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: 'green',
//     },
//   },
// });

const RedditTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: 'var(--color-ink-40)',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'none',
    '&.Mui-focused': {
      display: 'none',
    },
    '&.MuiFormLabel-filled': {
      display: 'none',
    },
  },
  '& .MuiInputBase-root': {
    color: 'var(--color-ink-100)',
    margin: 0,
    padding: 0,
    border: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    // '&.Mui-focused': {
    //   borderColor: theme.palette.primary.main,
    // },
    '& .MuiInputBase-input': {
      padding: 0,
      '&.Mui-focused': {
        position: 'relative',
        outline: 'none',
      },
    },
  },
}));

const CustomDatePicker: FC<CustomDatePickerProps> = ({
  calendars,
  value,
  error,
  helperText,
  helperTextEnd,
  isOpen,
  isInputDisabled,
  handleToggleOpen,
  handleOnOpen,
  handleOnClose,
  onDateChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onMouseOver,
  onMouseLeave,
}) => {
  const [isInputFocus, setInputFocus] = useState(false);
  const [isInputHover, setIsInputHover] = useState(false);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={{ start: 'Từ ngày', end: 'Đến ngày' }}
    >
      <DateRangePicker
        calendars={2}
        value={value}
        onChange={onDateChange}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <div
              className={`${
                isInputDisabled
                  ? 'border-input-ink bg-ink-10'
                  : error
                  ? 'border-input-red'
                  : isInputFocus || isInputHover
                  ? 'border-primary'
                  : 'border-input-ink'
              } p-4 flex items-center justify-between gap-4`}
              onBlur={() => {
                setInputFocus(false);
              }}
              onFocus={(e) => {
                setInputFocus(true);
              }}
              onMouseOver={(e) => {
                setIsInputHover(true);
              }}
              onMouseLeave={(e) => {
                setIsInputHover(false);
              }}
            >
              <div className="flex items-center justify-between flex-grow gap-4">
                <RedditTextField {...startProps} variant="standard" />
                <InputRightArrowSvg className="text-ink-100" />
                <RedditTextField {...endProps} variant="standard" />
              </div>
              <div className="cursor-pointer z-10" onClick={handleToggleOpen}>
                <InputDatePickerSeperatorSvg className="text-ink-100" />
              </div>
            </div>
          </React.Fragment>
        )}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
        open={isOpen}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
