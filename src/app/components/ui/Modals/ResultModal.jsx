import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FootTypo } from "../Typography";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { motion } from "framer-motion";

const SuccessCheckmark = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.2,
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <IoCheckmarkCircle size={40} color="green" />
    </motion.div>
  </motion.div>
);

const ErrorIcon = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.2,
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <IoCloseCircle size={40} color="red" />
    </motion.div>
  </motion.div>
);

const ResultModal = ({
  open,
  onClose,
  title,
  message,
  type = "success",
  confirmText = "Okay",
  cancelText = "Close",
  onConfirm,
  onCancel,
  showActions = true,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      suppressHydrationWarning
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      component={'div'}
      PaperProps={{
        className: "rounded-lg h-[19vh]",
        component: motion.div,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          className="text-center pt-8 pb-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              {type === "success" ? <SuccessCheckmark /> : <ErrorIcon />}
              <FootTypo
                footlabel={title}
                className="!m-0 text-xl font-semibold"
              />
            </div>
          </motion.div>
        </DialogTitle>

        <DialogContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-center"
          >
            <span className="text-gray-600">{message}</span>
          </motion.div>
        </DialogContent>

        {showActions && (
          <DialogActions className="!justify-center pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Button onClick={handleConfirm} variant="contained">
                {confirmText}
              </Button>
            </motion.div>
          </DialogActions>
        )}
      </motion.div>
    </Dialog>
  );
};

export default ResultModal;
