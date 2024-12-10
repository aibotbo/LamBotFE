import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/fonts.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { Provider } from 'react-redux';
import { store } from './stores/store';

// axios.defaults.headers.common['Authorization'] =
//   'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImFyZXNiby5jb20iLCJ0eXAiOiJKV1QifQ.eyJ1aWQiOiIxNjY0MDU1Mjk0NjU1Iiwibmlja19uYW1lIjoidG9wdG9wMzMzIiwic3lzdGVtIjoiYXJlc2JvLXdlYiIsImFwaV9rZXlfcmVxdWVzdF9pZCI6ImMwNmIwNDQwLTY2MzItNDEwNC04OTUyLTM1ZjVjYWU2NTYzYSIsImFwaV9rZXlfY2xpZW50X2lkIjoiYm8tYXBpIiwic2l0ZV9uYW1lIjoiYXJlc2JvLmNvbSIsImV4cCI6MTY4MDExMjI3MywiaXNzIjoiYXJlc2JvLmNvbSIsImF1ZCI6ImFyZXNiby13ZWIifQ.-WYHJQWmL9AJvkl0bMd4YXsRuN7-TWbZf7TboIinSl8';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
