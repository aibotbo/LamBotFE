import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import images from 'assets';

const About: FC = () => {
  return (
    <>
      <Helmet>
        <title>BotLambotrade | About Us</title>
      </Helmet>
      <div className="bg-test-orange bg-clip-text text-transparent">
        About Us
      </div>
    </>
  );
};

export default About;
