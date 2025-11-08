import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inputProduct } from "../services/ProductService.jsx";
import Swal from "sweetalert2";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const saveProduct = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!name || qty <= 0 || price <= 0) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please fill in all fields correctly.",
        icon: "warning",
      });
    }

    const product = {
      name,
      qty: Number(qty),
      price: Number(price),
    };

    try {
      setLoading(true);
      const data = await inputProduct(product);
      setLoading(false);
      if (data) {
        Swal.fire({
          title: "Success!",
          text: "Product has been added",
          icon: "success",
        });
        // Reset form
        setName("");
        setQty("");
        setPrice("");
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <form onSubmit={saveProduct} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-800">Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-800">QTY</label>
            <input
              type="number"
              name="qty"
              placeholder="QTY"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-800">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
