import secureLocalStorage from "react-secure-storage";
import axios from "../auth/AxiosConfig.jsx";

// Cache untuk request
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Helper function untuk cache management
const getCachedData = (key) => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  requestCache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  requestCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Helper function untuk get auth header
const getAuthHeader = () => ({
  Authorization: `Bearer ${secureLocalStorage.getItem("accessToken")}`,
});

// Helper function untuk handle errors
const handleError = (error) => {
  if (error.response) {
    const errorData = error.response.data;
    throw new Error(errorData.error || errorData.message || 'Request failed');
  } else if (error.request) {
    throw new Error('Network error - no response received');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Retry mechanism
const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.response?.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

export const getAllProduct = async (url) => {
  const cacheKey = `products_${url}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() => 
      axios.get(url, {
        headers: getAuthHeader(),
        timeout: 10000, // 10 second timeout
      })
    );
    
    const data = response.data.data;
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await retryRequest(() =>
      axios.delete(`/api/products/${id}`, {
        headers: getAuthHeader(),
        timeout: 10000,
      })
    );
    
    // Clear cache after successful deletion
    requestCache.clear();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const inputProduct = async (data) => {
  try {
    const response = await retryRequest(() =>
      axios.post("/api/products", data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      })
    );
    
    // Clear cache after successful creation
    requestCache.clear();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await retryRequest(() =>
      axios.put(`/api/products/${id}`, data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      })
    );
    
    // Clear cache after successful update
    requestCache.clear();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProductById = async (id) => {
  const cacheKey = `product_${id}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await retryRequest(() =>
      axios.get(`/api/products/${id}`, {
        headers: getAuthHeader(),
        timeout: 10000,
      })
    );
    
    const data = response.data.data;
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Utility function untuk clear cache
export const clearProductCache = () => {
  requestCache.clear();
};
