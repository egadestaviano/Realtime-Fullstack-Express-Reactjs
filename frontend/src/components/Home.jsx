import { useMemo, useCallback, Suspense } from 'react';
import useSWR, { useSWRConfig } from "swr";
import { deleteProduct, getAllProduct, clearProductCache } from "../services/ProductService.jsx";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Error component
const ErrorMessage = ({ message }) => (
  <div className="text-center py-8">
    <div className="text-red-500 mb-2">⚠️</div>
    <p className="text-red-600">{message}</p>
  </div>
);

// Product table row component
const ProductRow = React.memo(({ product, index, onDelete, onEdit }) => (
  <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
    <td className="py-3 px-2 text-center">{index + 1}</td>
    <td className="py-3 px-2 font-medium">{product.name}</td>
    <td className="py-3 px-2 text-right">{product.qty.toLocaleString()}</td>
    <td className="py-3 px-2 text-right">${product.price.toFixed(2)}</td>
    <td className="py-3 px-2 text-center space-x-2">
      <button
        onClick={() => onEdit(product.id)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        Delete
      </button>
    </td>
  </tr>
));

// Product table component
const ProductTable = React.memo(({ data, onDelete, onEdit }) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <div className="relative shadow rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="py-3 px-2 text-center">No</th>
            <th className="py-3 px-2">Product Name</th>
            <th className="py-3 px-2 text-right">QTY</th>
            <th className="py-3 px-2 text-right">Price</th>
            <th className="py-3 px-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

const Home = () => {
  const { mutate } = useSWRConfig();

  const fetcher = useCallback(async (url) => {
    return await getAllProduct(url);
  }, []);

  const { data, error, isLoading, mutate: refetch } = useSWR("/api/products", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  const handleDelete = useCallback(async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Confirmation",
      text: "Are you sure you want to delete this product?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(id);
        clearProductCache();
        refetch();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: err.message || "Failed to delete the product.",
        });
      }
    }
  }, [refetch]);

  const handleEdit = useCallback((id) => {
    // Navigation will be handled by Link component
  }, []);

  const handleRefresh = useCallback(() => {
    clearProductCache();
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col mt-5 px-4">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">Product List</h1>
            <div className="space-x-2">
              <button
                onClick={handleRefresh}
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                disabled
              >
                Refresh
              </button>
              <Link
                to="/add"
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                + Add New
              </Link>
            </div>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mt-5 px-4">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">Product List</h1>
            <div className="space-x-2">
              <button
                onClick={handleRefresh}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Retry
              </button>
              <Link
                to="/add"
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                + Add New
              </Link>
            </div>
          </div>
          <ErrorMessage message="Failed to load data. Please try again." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-5 px-4">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Product List</h1>
          <div className="space-x-2">
            <button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Refresh
            </button>
            <Link
              to="/add"
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              + Add New
            </Link>
          </div>
        </div>

        {data && data.length > 0 ? (
          <ProductTable
            data={data}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📦</div>
            <p className="text-gray-500">No Products Available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
