import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { getData } from "country-list";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/customer/component-styles/modals/SignUpForm.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faCaretDown,
  faUser,
  faLock,
  faLocationDot,
  faCalendar,
  faGlobe,
  faTreeCity,
  faMapLocationDot,
  faPhone,
  faHouseFlag,
} from "@fortawesome/free-solid-svg-icons";

import { signupUser } from "../../../api/authApi";
import { useUserAuthModal } from "../../../context/UserAuthModalContext";

const SignUpForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    gender: "",
    birthDate: null,
    country: null,
    state: "",
    city: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });

  const { closeModal } = useUserAuthModal();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const countries = getData().map((country) => ({
    value: country.code,
    label: country.name,
  }));

  const blankStyles = {
    control: () => ({
      all: "unset",
      borderBottom: "1px solid #333",
      height: "30px",
      width: "100%",
      marginBottom: "25px",
    }),
    valueContainer: () => ({
      padding: 0,
      height: "30px",
      display: "flex",
      alignItems: "center",
    }),
    placeholder: () => ({
      color: "#333",
      fontSize: "13px",
      lineHeight: "30px",
    }),
    singleValue: () => ({
      color: "#000",
      fontSize: "13px",
      lineHeight: "30px",
    }),
    dropdownIndicator: () => ({
      display: "none",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: () => ({
      backgroundColor: "#fff",
      fontSize: "13px",
      zIndex: 1001,
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    }),
    option: () => ({
      padding: "4px 8px",
      cursor: "pointer",
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "#035a52",
        color: "#e8eae5",
      },
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selected) => {
    setForm((prev) => ({ ...prev, country: selected }));
  };

  const handleBirthDateChange = (date) => {
    setForm((prev) => ({ ...prev, birthDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address1.trim() ||
      !form.gender ||
      !form.birthDate ||
      !form.country ||
      !form.state.trim() ||
      !form.city.trim() ||
      !form.zipCode.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setErrorMsg("Please fill in all the required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const userData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address1: form.address1.trim(),
      address2: form.address2.trim(),
      gender: form.gender
        ? form.gender.charAt(0).toUpperCase() +
          form.gender.slice(1).toLowerCase()
        : "",
      birthDate: form.birthDate
        ? form.birthDate.toISOString().split("T")[0]
        : null,
      country: form.country?.value || null,
      state: form.state.trim(),
      city: form.city.trim(),
      zipCode: form.zipCode.trim(),
      password: form.password,
    };

    setIsLoading(true);

    try {
      const message = await signupUser(userData);

      setSuccessMsg("Signup successful! You can now log in.");

      setForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        gender: "",
        birthDate: null,
        country: null,
        state: "",
        city: "",
        zipCode: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inner">
      <div className="image-holder">
        <video src="/signUp.mov" loop muted autoPlay />
      </div>

      <form onSubmit={handleSubmit}>
        <h3>SignUp Form</h3>

        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="form-control"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="form-control"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-wrapper">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon icon={faUser} />
        </div>

        <div className="form-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon icon={faEnvelope} />
        </div>

        <div className="form-wrapper">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (eg. 012345678)"
            pattern="0\d{8,9}"
            maxLength={11}
            className="form-control"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon icon={faPhone} />
        </div>

        <div className="form-group">
          <div className="form-wrapper">
            <input
              type="text"
              name="address1"
              placeholder="Address Line 1 (eg. 123 Main Street)"
              className="form-control"
              value={form.address1}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faLocationDot} />
          </div>

          <div className="form-wrapper">
            <input
              type="text"
              name="address2"
              placeholder="Address Line 2 (eg. House No.123)"
              className="form-control"
              value={form.address2}
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
        </div>

        <div className="form-group">
          <div className="form-wrapper">
            <select
              name="gender"
              className="form-control"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <FontAwesomeIcon icon={faCaretDown} />
          </div>

          <div className="form-wrapper birthdate">
            <DatePicker
              selected={form.birthDate}
              onChange={handleBirthDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select your birth date"
              className="form-control"
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              required
            />
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>

        <div className="form-wrapper">
          <Select
            options={countries}
            value={form.country}
            onChange={handleCountryChange}
            placeholder="Select a country"
            styles={blankStyles}
            className="form-control country-selector"
          />
          <FontAwesomeIcon icon={faGlobe} />
        </div>

        <div className="form-group three">
          <div className="form-wrapper">
            <input
              type="text"
              name="state"
              placeholder="State"
              className="form-control"
              value={form.state}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faHouseFlag} />
          </div>

          <div className="form-wrapper">
            <input
              type="text"
              name="city"
              placeholder="City"
              className="form-control"
              value={form.city}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faTreeCity} />
          </div>

          <div className="form-wrapper">
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP Code"
              maxLength={10}
              className="form-control"
              value={form.zipCode}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon icon={faMapLocationDot} />
          </div>
        </div>

        <div className="form-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon icon={faLock} />
        </div>

        <div className="form-wrapper">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon icon={faLock} />
        </div>

        {errorMsg && <p className="error-messages">{errorMsg}</p>}
        {successMsg && <p className="success-messages">{successMsg}</p>}

        <button id="signup-btn" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Quantum size="20" speed="1.75" color="white" />
          ) : (
            <>
              Sign Up
              <FontAwesomeIcon icon={faArrowRight} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
