import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import images from 'assets';
import HomeWelcome from './HomeWelcome';
import HomeGridRowOne from './HomeGridRowOne';
import HomeGridRowTwo from './HomeGridRowTwo';

const Home: FC = () => {
  return (
    <>
      <Helmet>
        <title>BotLambotrade | Home</title>
      </Helmet>
      <HomeWelcome />
      <HomeGridRowOne />
      <HomeGridRowTwo />
    </>
  );
};

export default Home;
