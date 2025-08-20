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
    // In a real app, you'd handle this error more gracefully
    return [];
  }
}