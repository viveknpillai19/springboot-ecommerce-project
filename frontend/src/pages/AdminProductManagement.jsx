import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchProducts, 
  createProduct, 
  deleteProduct, 
  fetchCategories, 
  fetchBrands 
} from '../services/apiClient';
import { 
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Modal, TextField, FormControl, 
  InputLabel, Accordion, AccordionSummary, AccordionDetails, Autocomplete 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Style for the modal form
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};

function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { token } = useAuth();

  // Function to load all necessary data from the backend
  const loadData = async () => {
    try {
      const productsData = await fetchProducts();
      const categoriesData = await fetchCategories();
      const brandsData = await fetchBrands();
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId, token);
      loadData(); // Refresh list
    }
  };
  
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    // Reset form state when closing
    setNewProduct({ name: '', description: '', price: '', stock: '' });
    setSelectedCategory(null);
    setSelectedBrand(null);
    setImageFile(null);
  };

  const handleFormChange = (e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleCreateProduct = async () => {
     // --- START DEBUGGING ---
  console.log("Checking form state before saving:");
  console.log("Selected Category:", selectedCategory);
  console.log("Selected Brand:", selectedBrand);
  console.log("Other Product Details:", newProduct);
  // --- END DEBUGGING ---
    if (!selectedCategory || !selectedBrand || !newProduct.price || !newProduct.stock) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
      };
      
      // Handle Category selection (new or existing)
      if (typeof selectedCategory === 'string') {
        productData.newCategoryName = selectedCategory;
      } else if (selectedCategory?.id) {
        productData.categoryId = selectedCategory.id;
      }
      
      // Handle Brand selection (new or existing)
      if (typeof selectedBrand === 'string') {
        productData.newBrandName = selectedBrand;
      } else if (selectedBrand?.id) {
        productData.brandId = selectedBrand.id;
      }

      await createProduct(productData, imageFile, token);
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Error creating product.");
    }
  };

  // Group products by category for the main display
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoryName || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Manage Products</Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenModal}>
          Add New Product
        </Button>
      </Box>
      
      {/* Accordion display for existing products */}
      {Object.entries(groupedProducts).map(([category, productList]) => (
        <Accordion key={category} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{category} ({productList.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell><img src={product.imageUrl} alt={product.name} width="40" style={{ borderRadius: '4px' }} /></TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(product.id)} color="error"><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modal for adding a new product */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add a New Product</Typography>
          <TextField name="name" label="Product Name" fullWidth onChange={handleFormChange} />
          <TextField name="description" label="Description" fullWidth onChange={handleFormChange} />
          <TextField name="price" label="Price" type="number" fullWidth onChange={handleFormChange} />
          <TextField name="stock" label="Stock Quantity" type="number" fullWidth onChange={handleFormChange} />
          
          <Autocomplete
            freeSolo options={categories} getOptionLabel={(option) => option.name || option}
            value={selectedCategory} onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => <TextField {...params} label="Category (select or type new)" />}
          />

          <Autocomplete
            freeSolo options={brands} getOptionLabel={(option) => option.name || option}
            value={selectedBrand} onChange={(event, newValue) => setSelectedBrand(newValue)}
            renderInput={(params) => <TextField {...params} label="Brand (select or type new)" />}
          />
          
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {imageFile && <Typography variant="caption">{imageFile.name}</Typography>}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateProduct}>Create</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AdminProductManagement;