const BASE_URL = 'http://localhost:8080/api';

export async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

// Add this new function to the file
export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }
  return await response.json();
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role: 'ROLE_USER' }),
  });

  if (!response.ok) {
    // You could add more specific error handling here
    throw new Error('Registration failed');
  }
  return await response.json();
}

export async function getCart(token) {
  const response = await fetch(`${BASE_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch cart');
  return await response.json();
}

export async function addItemToCart(productId, quantity, token) {
  const response = await fetch(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) throw new Error('Failed to add item to cart');
  return await response.json();
}

export async function removeItemFromCart(productId, token) {
  const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to remove item from cart');
  return await response.json();
}

export async function placeOrder(token) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    // The backend's GlobalExceptionHandler will provide the error message
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to place order');
  }
  return await response.text(); // The backend returns a success string
}

export async function fetchOrders(token) {
  const response = await fetch(`${BASE_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return await response.json();
}

export async function fetchAllOrders(token) {
  const response = await fetch(`${BASE_URL}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch all orders');
  return await response.json();
}

export async function updateOrderStatus(orderId, status, token) {
  const response = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return await response.json();
}

export async function fetchUserProfile(token) {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return await response.json();
}

export async function updateUserProfile(profileData, token) {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update user profile');
  return await response.json();
}
export async function updateProduct(productId, productData, imageFile, token) {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${BASE_URL}/admin/products/${productId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update product');
  return await response.json();
}

export async function deleteProduct(productId, token) {
  const response = await fetch(`${BASE_URL}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete product');
}

export async function createProduct(productData, imageFile, token) {
  const formData = new FormData();
  // The 'product' part must match the @RequestPart name in the backend controller
  formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
  formData.append('image', imageFile);

  const response = await fetch(`${BASE_URL}/admin/products`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create product');
  return await response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return await response.json();
}

export async function fetchBrands() {
  const response = await fetch(`${BASE_URL}/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  return await response.json();
}

export async function createCategory(categoryData, token) {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) throw new Error('Failed to create category');
  return await response.json();
}