import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function New() {
  const navigate = useNavigate();
  let [formdata, setformdata] = useState({
    platform: "",
    description: "",
    price: "",
    images: "",
  });

  let handleChange = (e) => {
    // let formData = e.target.name;
    // let formValue = e.target.value;
    setformdata((currdata) => {
      return { ...currdata, [e.target.name]: e.target.value };
    });
  };
  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending formdata:", formdata);

    try {
      const res = await fetch("http://localhost:8080/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify(formdata),

      });

      console.log(formdata);
      setformdata({ platform: "", description: "", price: "", images: "" });
      navigate("/");
      const data = await res.json();
      console.log("server response", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="platform">Enter the platform</label>

        <input
          type="text"
          placeholder="Enter the platform name "
          id="platform"
          name="platform"
          value={formdata.platform}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="description">Enter the description</label>
        <input
          type="description"
          placeholder="Enter the description "
          id="description"
          name="description"
          value={formdata.description}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="price">Enter price</label>
        <input
          type="number"
          placeholder="Enter the price"
          id="price"
          name="price"
          value={formdata.price}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="images">paste image url</label>
        <input
          type="text"
          placeholder="Enter the image url"
          id="images"
          name="images"
          value={formdata.images}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default New;
