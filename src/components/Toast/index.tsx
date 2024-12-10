import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';
import './toast.css';
import { Cancel } from '@mui/icons-material';

const Toast = () => {
  const notifications = useAppSelector((state) => state.ui.notifications);
  const autoDeleteNotification = useAppSelector(
    (state) => state.ui.autoDeleteNotification
  );
  const dispatch = useAppDispatch();

  const deleteToast = useCallback(
    (id: number) => {
      if (notifications.length <= 1)
        dispatch(uiActions.updateNotifications([]));
      else {
        const listItemIndex = notifications.findIndex((e) => e.id === id);
        const tempNotifications = [...notifications];
        // if (listItemIndex > -1) {
        tempNotifications.splice(listItemIndex, 1);
        // }
        dispatch(uiActions.updateNotifications([...tempNotifications]));
      }
    },
    [dispatch, notifications]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        autoDeleteNotification &&
        notifications.length &&
        notifications.length
      ) {
        deleteToast(notifications[0].id);
      }
    }, autoDeleteNotification);

    return () => {
      clearInterval(interval);
    };
  }, [autoDeleteNotification, deleteToast, notifications]);

  return (
    <>
      {/* <div className={`notification-container top-right`}>
        {notifications.map((notification, index) => (
          <>
          <div
            key={index}
            className={`notification toast top-right`}
            style={{ backgroundColor: notification.backgroundColor }}
          >
            <button onClick={() => deleteToast(notification.id)}>X</button>
            <div className="notification-image">
              <img src={notification.icon} alt="" />
            </div>
            <div>
              <p className="notification-title">{notification.title}</p>
              <p className="notification-message">{notification.description}</p>
            </div>
          </div>
          </>
        ))}
      </div> */}
      <div className={`z-[9999] fixed top-6 right-6`}>
        {notifications.map((notification, index) => (
          <>
            <div
              key={index}
              className={`mb-4 flex items-center justify-between gap-x-3 p-4 rounded-3xl w-[25rem] transition-all bg-dropdown toast-in-right`}
            >
              <div className="flex items-center justify-between gap-x-3">
                <div className="flex-shrink-0 p-[0.625rem] rounded-2xl bg-ink-05">
                  <img
                    className="w-8"
                    src={notification.icon}
                    alt="BotLambotrade"
                  />
                </div>
                <div>
                  <p
                    className={`mb-1 font-bold ${notification.backgroundColor}`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-ink-80 text-sm">
                    {notification.description}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteToast(notification.id)}>
                <Cancel className="fill-ink-100" />
              </button>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Toast;
