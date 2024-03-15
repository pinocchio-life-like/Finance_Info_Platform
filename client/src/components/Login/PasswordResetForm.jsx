import { useState } from "react";
import PropTypes from "prop-types";

function ResetPasswordForm({ onSubmit, error }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(email);
    console.log('reset sent')
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        style={{ width: "450px", height: "470px" }}
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center"
      >
        <h2 style={{ color: "#241F1F" }} className="text-2xl mt-5 font-sans">
          Reset Password
        </h2>
        <p className="text-sm mt-2">Please enter your email address to reset your password.
        </p>
        <div className="relative mt-10 mb-4 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6 w-full">
          <input
            style={{
              background: "linear-gradient(to right, #013E7A, #0057A6)",
            }}
            type="submit"
            value="Reset Password"
            className="text-white font-bold py-3 px-4 w-full rounded focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
      </form>
    </div>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default ResetPasswordForm;
