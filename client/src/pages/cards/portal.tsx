import { createPortal } from "react-dom";

const Portal = ({ children, target } : any) => {
    const element = document.getElementById(target);
    return element ? createPortal(children, element) : null;
  };
  
  export default Portal;