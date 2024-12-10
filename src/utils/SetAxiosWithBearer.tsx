import axios from 'axios';

const setAxiosWithBearer = (accessToken: string) => {
  if (!accessToken) {
    axios.defaults.headers.common['Authorization'] = null;
    return;
  }

  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  // axios.interceptors.request.use(
  //   (request) => {
  //     // Edit request config

  //     return request;
  //   },
  //   (error) => {
  //     console.log(error);
  //     return Promise.reject(error);
  //   }
  // );

  // axios.interceptors.response.use(
  //   (response) => {
  //     console.log(response);
  //     // Edit response config
  //     return response;
  //   },
  //   (error) => {
  //     console.log(error);
  //     return Promise.reject(error);
  //   }
  // );
};

export default setAxiosWithBearer;
