"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const docusign = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/docusign`,
        formData,
        { withCredentials: true }
      );
      window.open(res.data.redirectUrl, "_blank");
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div>
      <form onSubmit={docusign}>
        <label htmlFor="name">Name:</label>
        <input
          value={formData.name}
          onChange={handleInputChange}
          id="name"
          name="name"
          type="text"
        />
        <label htmlFor="email">Email:</label>
        <input
          value={formData.email}
          onChange={handleInputChange}
          id="email"
          name="email"
          type="email"
        />
        <label htmlFor="company">Company Name:</label>
        <input
          value={formData.company}
          onChange={handleInputChange}
          id="company"
          name="company"
          type="text"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
