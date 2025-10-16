import { Link } from "react-router-dom";

const ButtonGroupLogin = (prop) => {
  const { text, bgColor, textColor } = prop;

  return (
    <Link
      to="/"
      className={`border-2 border-solid px-4 py-2 rounded-md ml-4 ${bgColor} ${textColor}`}
    >
      {text}
    </Link>
  );
};

export default ButtonGroupLogin;
