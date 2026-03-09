import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";

const CategoryPage = () => {
  const { category } = useParams();
  const { products, fetchProductsByCategory, loading } = useProductStore();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [category]);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category} Products
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-400">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow bg-gray-800"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-3 text-lg font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-emerald-400">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;


