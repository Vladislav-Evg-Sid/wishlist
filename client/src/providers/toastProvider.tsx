import { Bounce, ToastContainer } from "react-toastify";

export default function BaseToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      newestOnTop={false}
      closeOnClick
      theme="light"
      transition={Bounce}
    />
  );
}
