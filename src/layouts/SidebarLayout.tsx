import Sidebar from 'components/Sidebar';
import Navbar from 'components/Navbar';
import React, { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Toast from 'components/Toast';
import { useAppSelector } from 'stores/hooks';
import { useMediaQuery } from 'react-responsive';

const Layout: FC = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [isInitialized, setIsInitialized] = useState(false);
  const isTablet = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && isInitialized) navigate('/login');
    setIsInitialized(true);
  }, [isLoggedIn, navigate, isInitialized]);

  return (
    <div>
      <Sidebar />
      <div
        className={`2xl:ml-[280px] min-h-screen xl:ml-[200px] mt-[5.25rem] xl:mt-0 pt-4 px-4 md:px-12 lg:px-20 xl:px-16 3xl:px-24`}
      >
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
