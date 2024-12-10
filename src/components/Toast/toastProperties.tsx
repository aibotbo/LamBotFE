import checkIcon from './assets/check.svg';
import errorIcon from './assets/error.svg';
import infoIcon from './assets/info.svg';
import warningIcon from './assets/warning.svg';

export const TOAST_PROPERTIES = [
  {
    id: Math.floor(Math.random() * 101 + 1),
    title: 'Thành công',
    description: 'This is a success toast component',
    backgroundColor: 'text-green-100',
    icon: checkIcon,
  },
  {
    id: Math.floor(Math.random() * 101 + 1),
    title: 'DANGER',
    description: 'This is an error toast component',
    backgroundColor: 'text-red-100',
    icon: errorIcon,
  },
  {
    id: Math.floor(Math.random() * 101 + 1),
    title: 'INFO',
    description: 'This is an info toast component',
    backgroundColor: '#5bc0de',
    icon: infoIcon,
  },
  {
    id: Math.floor(Math.random() * 101 + 1),
    title: 'WARNING',
    description: 'This is a warning toast component',
    backgroundColor: '#f0ad4e',
    icon: warningIcon,
  },
];

export const BUTTON_PROPS = [
  {
    id: 1,
    type: 'success',
    className: 'success',
    label: 'Success',
  },
  {
    id: 2,
    type: 'danger',
    className: 'danger',
    label: 'Danger',
  },
  {
    id: 3,
    type: 'info',
    className: 'info',
    label: 'Info',
  },
  {
    id: 4,
    type: 'warning',
    className: 'warning',
    label: 'Warning',
  },
];
