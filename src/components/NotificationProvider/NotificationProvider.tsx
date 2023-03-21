import React from "react";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type NotificationMessage = {
  isOpen: boolean;
  message: string;
  type: AlertColor;
};

export const NotificationContext = React.createContext<{
  setNotification: (message: NotificationMessage) => void;
}>({
  setNotification: (message) => {
    console.log(message);
  },
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [notification, setNotification] = React.useState<NotificationMessage>({
    message: "",
    isOpen: false,
    type: "success",
  });

  const handleClose = React.useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setNotification((currentState) => ({
        ...currentState,
        isOpen: false,
      }));
    },
    [setNotification]
  );

  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={notification.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
