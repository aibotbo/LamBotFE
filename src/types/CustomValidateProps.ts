export default interface CustomValidateModelProps {
  isOpen: boolean;
  icon: string;
  headingMessage: React.ReactNode;
  message: React.ReactNode;
  buttonMessage: React.ReactNode,
  handleOpen: () => void;
  handleClose: () => void;
}