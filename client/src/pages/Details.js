import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import InputGroup from '../components/InputGroup';

function Details() {
  const [form, setForm] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear the error message when the user starts typing again
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`/api/users`, form) // Use POST method to add a new user
      .then((res) => {
        navigate('/');
      })
      .catch((err) => setErrors(err.response.data));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setForm(response.data);
      } catch (error) {
        // Handle any error that occurred during the request
        // For example, you might want to show an error message or navigate back to the home page
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mt-4 col-12 col-lg-4">
      <form onSubmit={onSubmitHandler}>
        <InputGroup
          label="Email"
          type="text"
          name="email"
          onChangeHandler={onChangeHandler}
          errors={errors.email}
          value={form.email || ''}
        />
        <InputGroup
          label="Lastname"
          type="text"
          name="lastname"
          onChangeHandler={onChangeHandler}
          errors={errors.lastname}
          value={form.lastname || ''}
        />
        <InputGroup
          label="Firstname"
          type="text"
          name="firstname"
          onChangeHandler={onChangeHandler}
          errors={errors.firstname}
          value={form.firstname || ''}
        />
        <InputGroup
          label="Age"
          type="text"
          name="age"
          onChangeHandler={onChangeHandler}
          errors={errors.age}
          value={form.age || ''}
        />
        <button className="btn btn-primary" type="submit">
          Add user
        </button>
      </form>
    </div>
  );
}

export default Details;
