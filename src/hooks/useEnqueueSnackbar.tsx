import CustomSnackbar from 'components/CustomSnackbar';
import { OptionsObject, useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useEnqueueSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const pushSnackbar = useCallback(
    (
      message: string,
      // extend the default options object
      options?: OptionsObject &
        Partial<{ variant: 'success' | 'error' | 'warning' }>
    ) => {
      enqueueSnackbar(message, {
        ...options,
        content: (key) => {
          // destructure the options we need from the extended options
          // object, and provide a default case if we didn't provide any
          const { variant } = options || { variant: undefined };
          const handleCloseSnackbar = () => {
            closeSnackbar(key);
          };
          return (
            <CustomSnackbar
              id={`${key}`}
              message={message}
              variant={variant || 'success'}
              closeSnackBar={handleCloseSnackbar}
            />
          );
        },
      });
    },
    [closeSnackbar, enqueueSnackbar]
  );

  return pushSnackbar;
};
