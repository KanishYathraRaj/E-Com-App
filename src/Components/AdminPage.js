import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', image_url: '', price: '', stock: '', description: '', category: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log form data for debugging
    console.log('Form Data:', form);

    // Validate form data
    if (!form.name || !form.image_url || !form.price || !form.stock || !form.description) {
      alert('Please fill in all required fields.');
      return;
    }

    // Prepare data for submission
    const productData = {
      name: form.name,
      image_url: form.image_url,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      description: form.description,
      category: form.category || '',
    };

    try {
      let response;
      if (form.id) {
        // Update existing product
        response = await axios.put(`http://127.0.0.1:8000/api/products/${form.id}/`, productData);
        if (response.status !== 200) {
          throw new Error(`Failed to update product: ${response.statusText}`);
        }
      } else {
        // Create new product
        response = await axios.post('http://127.0.0.1:8000/api/products/', productData);
        if (response.status !== 201) {
          throw new Error(`Failed to create product: ${response.statusText}`);
        }
      }

      // Reset form and fetch products
      setForm({ id: null, name: '', image_url: '', price: '', stock: '', description: '', category: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
    });
  };

  const handleDelete = async (id) => {
    if (id === null || id === undefined) {
      console.error('Invalid product ID:', id);
      return;
    }

    console.log('Deleting product with ID:', id); // Debug log
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`);
      if (response.status !== 204) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{form.id ? 'Edit Product' : 'Add Product'}</h2>
        <label>
          Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Image URL:
          <input type="text" name="image_url" value={form.image_url} onChange={handleChange} required />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </label>
        <label>
          Stock:
          <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={form.description} onChange={handleChange} required></textarea>
        </label>
        <label>
          Category:
          <input type="text" name="category" value={form.category} onChange={handleChange} />
        </label>
        <button type="submit">{form.id ? 'Update' : 'Add'} Product</button>
      </form>
      <div className="product-list-2">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <img src={product.image_url} alt={product.name} />
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
