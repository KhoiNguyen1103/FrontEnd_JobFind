//https://www.topcv.vn/login
import { useState } from "react";
import FormLoginJSKer from "./FormLoginJSKer.jsx.jsx";
import FormRegisterJSKer from "./FormRegisterJSKer.jsx";
import VisualJSKer from "./VisualJSKer.jsx";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Form Login / register */}
      {isLogin ? (
        <FormLoginJSKer setIsLogin={setIsLogin} />
      ) : (
        <FormRegisterJSKer setIsLogin={setIsLogin} />
      )}

      {/* Right column - visuale */}
      <VisualJSKer />
    </div>
  );
};

export default Login;
