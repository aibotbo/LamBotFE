// import { useState, useEffect, useCallback } from 'react';

// const useIsTabVisible = () => {
//   const [isVisible, setIsVisible] = useState(!document.hidden);

//   const handleVisibility = useCallback(() => {
//     setIsVisible(!document.hidden);
//   }, []);

//   useEffect(() => {
//     document.addEventListener('visibilitychange', handleVisibility);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibility);
//     };
//   }, [handleVisibility]);

//   return [isVisible, setIsVisible]; // returns boolean
// };

// export default useIsTabVisible;

import { useState, useEffect } from 'react';

const useWindowFocus = (callback: () => void) => {
  const [isWindowFocused, setWindowFocus] = useState(true);

  useEffect(() => {
    const handleWindowFocus = () => {
      setWindowFocus(true);
      callback();
    };
    const handleWindowBlur = () => setWindowFocus(false);

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [callback]);

  return isWindowFocused;
};

export default useWindowFocus;
