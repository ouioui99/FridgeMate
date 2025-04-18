import { useState, useCallback } from "react";

export const useSnackbar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    message,
    showMessage,
    hideSnackbar,
  };
};
