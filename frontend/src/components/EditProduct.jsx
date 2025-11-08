import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/ProductService.jsx";
import Swal from "sweetalert2";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const editProduct = async (e) => {
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
      const data = await updateProduct(id, product);
      setLoading(false);
      if (data) {
        Swal.fire({
          title: "Success!",
          text: "Product has been updated",
          icon: "success",
        });
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setLoading(false);
        if (data) {
          setName(data.name);
          setQty(data.qty);
          setPrice(data.price);
        }
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: "Failed to load product.",
          icon: "error",
        });
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Product</h2>
      {loading ? (
        <p className="text-center text-slate-600">Loading...</p>
      ) : (
        <form onSubmit={editProduct} className="my-10">
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
      )}
    </div>
  );
};

export default EditProduct;
