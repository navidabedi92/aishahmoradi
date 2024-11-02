"use client";
import {
  API_ADDRESS,
  HEADER_AUTH,
  Header_WebSiteCode,
  IsCompressed,
  WITH_MEDIA_BINARY,
} from "../utils/Constants";
import {
  Base64,
  FetchCountries,
  LoginSiteMember,
  RegisterSiteMember,
} from "../utils/Common";

import React, { useEffect, useState } from "react";
import { revalidatePath } from "next/cache";
import { useDispatch, useSelector } from "react-redux";
import { SliceAction } from "@/store/store";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [roleForSign, setRole] = useState("Organization");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const dispatch = useDispatch();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      FetchCountries()
        .then((response) => {
          response = response?.data;
          if (response.IsSuccessfull) {
            response = JSON.parse(response.Data);
            setCountryList(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isOpen]);

  const validatePassword = (password) => {
    const errors = [];
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /(_|[^\w])/.test(password);

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long.`);
    }
    if (!hasUpperCase) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!hasLowerCase) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!hasNumber) {
      errors.push("Password must contain at least one number.");
    }
    if (!hasSpecialChar) {
      errors.push("Password must contain at least one special character.");
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validate password
    const errors = validatePassword(data.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    } else {
      setPasswordErrors([]); // Clear errors if validation passes
    }

    if (data.password !== data.passwordConfirm && !isLogin) {
      return alert("Confirm password is not equal to password! try again");
    }

    try {
      if (isLogin) {
        // Handle login
        LoginSiteMember(data.email, data.password)
          .then((response) => {
            response = response?.data;

            if (response.IsSuccessfull) {
              response = JSON.parse(response.Data)[0];
              const userData = {
                Firstname: response["Firstname"],
                Lastname: response["Lastname"],
                MemberID: response["MemberID"],
                Type: response["Type"],
              };

              const loginStatus = true; // or false, depending on the login state

              // Dispatch the action with the payload
              dispatch(
                SliceAction.setUserLogin({ userData, login: loginStatus })
              );

              onClose();
              setTimeout(() => {
                alert("You are now logged in.");
              }, 500);
            } else alert(" Email or Password is wrong");
          })
          .catch((error) => {
            alert(`Please call to Support Center. Error: ${error}`);
          });
      } else {
        // Handle signup
        let Data = {};
        Data["Type"] = data.role;
        Data["Firstname"] = data.firstName.trim();
        Data["Email"] = data.email.trim();
        Data["Country"] = data.country;
        Data["Username"] = data.email.trim();
        if (data.role == "Athlete" || data.role == "Judge") {
          Data["Lastname"] = data.lastName.trim();
          Data["Birthday"] = data.birthday;
          Data["IsMale"] = data.gender;
        }
        if (data.role == "Judge") {
          Data["IsHead"] = data.isHead;
        }
        RegisterSiteMember(Data, data.password.trim())
          .then((response) => {
            response = response?.data;

            if (IsCompressed.indexOf("true") > 0) {
              response = Base64.resolveResponse(response, false);
            }
            if (response.IsSuccessfull) {
              onClose();
            } else {
              alert(`This Email is used by another person`);
            }
          })
          .catch((error) => {
            alert(`Please call to Support Center. Error: ${error}`);
          });
      }
    } catch (error) {
      alert(`Please call to Support Center. Error: ${error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-full md:h-auto overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={() => setRole(event.target.value)}
                  >
                    <option value="Organization">Organization</option>
                    <option value="Athlete">Athlete</option>
                    <option value="Judge">Judge</option>
                  </select>
                </div>

                {roleForSign === "Judge" && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Is Judge Head?
                    </label>
                    <select
                      name="isHead"
                      className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                )}
              </div>
              {(roleForSign === "Athlete" || roleForSign === "Judge") && (
                <>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Birthday
                      </label>
                      <input
                        name="birthday"
                        type="date"
                        className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 ">
                        Gender
                      </label>
                      <select
                        name="gender"
                        className="border rounded w-full  p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {roleForSign === "Organization" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <select
                  name="country"
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {countryList.map((item) => (
                    <option key={item.Name} value={item.Name}>
                      {item.Name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordErrors.length > 0 && (
              <ul className="text-red-500 text-sm mt-1">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                name="passwordConfirm"
                type="password"
                className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              {passwordConfirm !== password && (
                <ul className="text-red-500 text-sm mt-1">
                  <li key={10}>
                    Confirm password is not equal to password! try again
                  </li>
                </ul>
              )}
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <button onClick={onClose} className="mt-2 text-red-500 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};
export default AuthModal;
