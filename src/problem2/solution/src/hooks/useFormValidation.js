import { useState, useEffect } from "react";

const useFormValidation = (initialValue, validate, callback) => {
  const [values, setValues] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setChangeValues(name, value);
  };

  const setChangeValues = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    };

    setValues(newValues);
    const listErrors = Object.keys(errors);
    if (listErrors.length) {
      setErrors(validate(newValues));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (Object.keys(validate(values)).length === 0) {
      callback();
    } else {
      setErrors(validate(values));
    }
  };

  const resetFields = () => {
    setValues(initialValue);
  };

  return { handleChange, handleSubmit, values, errors, resetFields };
};

export default useFormValidation;
