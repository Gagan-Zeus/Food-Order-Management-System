import React, { useState } from "react";
import { addFood } from "../../services/foodService";
import { toast } from "react-toastify";
import "./AddFood.css";
import { menuCategories } from "../../constants/menuCategories";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AddFood = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: menuCategories[0],
    price: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onImageChange = (event) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      setImage(null);
      return;
    }

    if (!selectedImage.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      setImage(null);
      return;
    }

    if (selectedImage.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 5 MB");
      event.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedImage);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    try {
      await addFood(data, image);
      toast.success("Food added successfully");
      setData({
        name: "",
        description: "",
        category: menuCategories[0],
        price: "",
      });
      setImage(null);
    } catch (error) {
      if (error.response?.status === 413) {
        toast.error("Image is too large. Please choose an image under 5 MB");
      } else {
        toast.error("Error adding food");
      }
    }
  };
  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Menu management</p>
          <h1>Add Food</h1>
          <p>Bring a new favourite to your menu.</p>
        </div>
        <span className="page-heading-art" aria-hidden="true"><i className="bi bi-stars" /></span>
      </div>
      <form className="add-food-layout" onSubmit={onSubmitHandler}>
        <section className="admin-panel">
          <div className="panel-heading"><div><h2>Food details</h2><p>Keep it clear, appetising, and easy to find.</p></div><span className="panel-step">01</span></div>
          <div className="food-details-fields">
            <div className="field-group">
              <label htmlFor="name">Food name <span>*</span></label>
              <input type="text" placeholder="e.g. Chicken Biryani" id="name" required name="name" onChange={onChangeHandler} value={data.name} />
            </div>
            <div className="field-group">
              <label htmlFor="description">Description <span>*</span></label>
              <textarea placeholder="Tell customers what makes this dish special..." id="description" rows="5" required name="description" onChange={onChangeHandler} value={data.description} />
              <small>A short, delicious description works best.</small>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label htmlFor="category">Category <span>*</span></label>
                <select name="category" id="category" onChange={onChangeHandler} value={data.category}>
                  {menuCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="price">Price <span>*</span></label>
                <input type="number" name="price" placeholder="₹ 200" id="price" min="0" step="0.01" required onChange={onChangeHandler} value={data.price} />
              </div>
            </div>
          </div>
          <div className="form-actions"><p><i className="bi bi-shield-check me-1" aria-hidden="true" /> Your menu is in good hands.</p><button type="submit" className="admin-button button-red"><i className="bi bi-plus-lg" aria-hidden="true" /> Add to menu</button></div>
        </section>
        <div className="food-image-column">
          <section className="admin-panel">
            <div className="panel-heading"><div><h2>Food image</h2><p>Make it look as good as it tastes.</p></div><span className="panel-step">02</span></div>
            <label htmlFor="image" className={`upload-area ${image ? "has-image" : ""}`}>
              {image ? <img src={URL.createObjectURL(image)} alt="Selected food preview" /> : <><i className="bi bi-cloud-arrow-up" aria-hidden="true" /><strong>Upload a food image</strong><span>PNG, JPG up to 5MB</span></>}
              {image && <span>Choose a different image</span>}
              <input type="file" id="image" accept="image/*" onChange={onImageChange} />
            </label>
            {image && <p className="upload-filename"><i className="bi bi-paperclip me-1" aria-hidden="true" />{image.name}</p>}
          </section>
          <div className="menu-tip"><i className="bi bi-lightbulb" aria-hidden="true" /><h3>A good first impression</h3><p>Bright, well-lit photos help customers discover their next favourite dish.</p></div>
        </div>
      </form>
    </div>
  );
};

export default AddFood;
