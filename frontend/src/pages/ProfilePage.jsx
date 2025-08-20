// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, updateUserProfile } from '../services/apiClient';
import { Typography, Box, TextField, Button, CircularProgress, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Fetches the user's profile when the component loads
  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchUserProfile(token);
        // The backend UserResponse has an 'addresses' field, let's use it
        setProfile({ name: data.name, addresses: data.addresses || [] });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) getProfile();
  }, [token]);

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...profile.addresses];
    updatedAddresses[index][field] = value;
    setProfile({ ...profile, addresses: updatedAddresses });
  };

  const handleAddAddress = () => {
    const newAddress = { street: '', city: '', state: '', postalCode: '', country: '' };
    setProfile({ ...profile, addresses: [...profile.addresses, newAddress] });
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = profile.addresses.filter((_, i) => i !== index);
    setProfile({ ...profile, addresses: updatedAddresses });
  };

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSave = async () => {
    try {
      // 1. Capture the updated profile returned from the API
      const updatedProfileData = await updateUserProfile(profile, token);
      
      // 2. Update the local state with the fresh data from the server.
      // This ensures we get the new address IDs from the database.
      setProfile({ name: updatedProfileData.name, addresses: updatedProfileData.addresses || [] });

      setNotification({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to update profile.', severity: 'error' });
    }
  };

  if (loading) return <CircularProgress />;
  if (!profile) return <Typography>Could not load profile.</Typography>;


  return (
    <Box>
      <Typography variant="h4" gutterBottom>Your Profile</Typography>
      <TextField
        label="Full Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        fullWidth
        sx={{ mb: 4 }}
      />

      <Typography variant="h5" gutterBottom>Saved Addresses</Typography>
      {profile.addresses.map((address, index) => (
        <Paper key={address.id || index} sx={{ p: 2, mb: 2, position: 'relative' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Street" value={address.street} onChange={(e) => handleAddressChange(index, 'street', e.target.value)} />
            <TextField label="City" value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} />
            <TextField label="State" value={address.state} onChange={(e) => handleAddressChange(index, 'state', e.target.value)} />
            <TextField label="Postal Code" value={address.postalCode} onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)} />
            <TextField label="Country" value={address.country} onChange={(e) => handleAddressChange(index, 'country', e.target.value)} />
          </Box>
          <IconButton onClick={() => handleRemoveAddress(index)} sx={{ position: 'absolute', top: 8, right: 8 }} color="error">
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}

      <Button startIcon={<AddCircleIcon />} onClick={handleAddAddress}>Add New Address</Button>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" onClick={handleSave}>Save Changes</Button>
      </Box>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProfilePage;