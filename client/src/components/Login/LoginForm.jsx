import { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/Images/logo.png";
import PropTypes from "prop-types";
function LoginForm({ onSubmit, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        style={{ width: "450px", height: "470px" }}
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
        <img
          style={{ width: "80px", height: "68px" }}
          src={logo}
          alt="Description"
          className="mt-4"
        />
        <h2 style={{ color: "#241F1F" }} className="text-2xl mt-5 font-sans">
          LOGIN
        </h2>
        <p className="text-sm mt-2">Please Enter Your Username and Password!</p>
        <div className="relative mt-10 mb-4 w-full">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative mb-6 w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="shadow appearance-none border rounded w-full py-3 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {showPassword ? (
            <FaEye
              onClick={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPassword(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          )}
        </div>
        <div className="mb-6 w-full">
          <input
            style={{
              background: "linear-gradient(to right, #013E7A, #0057A6)",
            }}
            type="submit"
            value="LOGIN"
            className=" text-white font-bold py-3 px-4 w-full rounded focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default LoginForm;
