import { useEffect } from "react";

const useOutsideClick = (ref, callback) => {
  console.log();

  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;
/////////////////////////////밖에클릭하는거
