import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Stack,
  Button,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';

import { fetchUserData, updateUserProfile } from '../Services/userService';

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    transition: '0.3s',

    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.08)',
    },

    '&:hover fieldset': {
      borderColor: '#9c27b0',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#9c27b0',
    },
  },

  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.6)',
  },

  '& .MuiInputBase-input': {
    color: '#fff',
  },
};

const cardStyles = {
  borderRadius: '24px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(14px)',
  transition: '0.3s ease',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  },
};

const Profile = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    team: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserData();

        setUser(userData);

        setFormData({
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          title: userData?.title || 'Team Member',
          department: userData?.department || 'Operations',
          team: userData?.team || 'General',
        });
      } catch (err) {
        setError(err.message || 'Unable to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedUser = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        department: formData.department,
        team: formData.team,
      });

      setUser(updatedUser);

      setSuccessMessage('Profile updated successfully');

      setIsEditDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Unable to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || 'Team Member',
        department: user.department || 'Operations',
        team: user.team || 'General',
      });
    }

    setIsEditDialogOpen(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'linear-gradient(135deg,#0f0f1f 0%, #16162f 45%, #1d1145 100%)',
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box
        sx={{
          p: 4,
          minHeight: '100vh',
          background:
            'linear-gradient(135deg,#0f0f1f 0%, #16162f 45%, #1d1145 100%)',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        color: '#fff',
        background:
          'linear-gradient(135deg,#0f0f1f 0%, #16162f 45%, #1d1145 100%)',
      }}
    >
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessMessage('')}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* HEADER */}

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '2.2rem', md: '3.4rem' },
              fontWeight: 800,
              // lineHeight: 1.1,
              background: 'linear-gradient(90deg,#ffffff,#b388ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Profile Center
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem',
            }}
          >
            Manage your personal information and account settings.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`Role: ${user.role?.toUpperCase()}`}
            sx={{
              bgcolor: '#9c27b0',
              color: '#fff',
              fontWeight: 700,
            }}
          />

          <Chip
            label={`Team: ${user.team || 'General'}`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.06)',
              color: '#fff',
            }}
          />

          <Chip
            label={`Dept: ${user.department || 'Operations'}`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.06)',
              color: '#fff',
            }}
          />
        </Stack>
      </Box>

      {/* MAIN CARD */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '30px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 50px rgba(0,0,0,0.3)',
        }}
      >
        <Grid container spacing={4}>
          {/* LEFT PROFILE CARD */}

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                ...cardStyles,
                p: 4,
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Avatar
                sx={{
                  width: 130,
                  height: 130,
                  mx: 'auto',
                  fontSize: 46,
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg,#7b61ff,#9c27b0)',
                  boxShadow:
                    '0 10px 30px rgba(123,97,255,0.4)',
                }}
              >
                {initials || 'U'}
              </Avatar>

              <Typography
                sx={{
                  mt: 3,
                  fontSize: '2rem',
                  fontWeight: 800,
                }}
              >
                {user.name}
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  mt: 1,
                }}
              >
                {user.title || 'Team Member'}
              </Typography>

              <Stack
                direction="row"
                justifyContent="center"
                spacing={1}
                flexWrap="wrap"
                sx={{ mt: 3 }}
              >
                <Chip
                  label={user.role?.toUpperCase()}
                  sx={{
                    bgcolor: '#9c27b0',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                />

                <Chip
                  label={user.department || 'Operations'}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                  }}
                />
              </Stack>

              <Button
                variant="contained"
                onClick={() => setIsEditDialogOpen(true)}
                sx={{
                  mt: 5,
                  px: 5,
                  py: 1.3,
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg,#7b61ff,#9c27b0)',

                  '&:hover': {
                    background:
                      'linear-gradient(135deg,#6949ff,#8e24aa)',
                  },
                }}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>

          {/* RIGHT SECTION */}

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  ...cardStyles,
                  p: 4,
                  minHeight: 460,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Personal Information
                </Typography>

                <Divider
                  sx={{
                    borderColor: 'rgba(255,255,255,0.08)',
                    mb: 4,
                  }}
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={user.name}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={user.email}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={user.title || 'Team Member'}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={user.phone || 'Not provided'}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={user.department || 'Operations'}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Team"
                      value={user.team || 'General'}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={user.role?.toUpperCase()}
                      InputProps={{ readOnly: true }}
                      sx={inputStyles}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* INFO CARDS */}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...cardStyles,
                      p: 4,
                      minHeight: 220,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        About
                      </Typography>

                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.75)',
                          lineHeight: 1.8,
                        }}
                      >
                        Profile details help your team collaborate smoothly and keep assignments aligned.
                      </Typography>
                    </Box>

                    <Chip
                      label="Team-friendly profile"
                      sx={{
                        mt: 3,
                        alignSelf: 'flex-start',
                        bgcolor: 'rgba(156,39,176,0.16)',
                        color: '#e1c7ff',
                        fontWeight: 700,
                      }}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...cardStyles,
                      p: 4,
                      minHeight: 220,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Updates
                      </Typography>

                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.75)',
                          lineHeight: 1.8,
                        }}
                      >
                        Keep your details refreshed. Changes are updated instantly, while role control stays locked for security.
                      </Typography>
                    </Box>

                    <Chip
                      label="Modern UX"
                      sx={{
                        mt: 3,
                        alignSelf: 'flex-start',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* EDIT DIALOG */}

      <Dialog
        open={isEditDialogOpen}
        onClose={handleCancel}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '28px',
            background: '#16162d',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
          }}
        >
          Edit Profile
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                name="title"
                value={formData.title}
                onChange={handleChange}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                sx={inputStyles}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCancel}
            sx={{
              color: '#fff',
              borderRadius: '12px',
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              borderRadius: '12px',
              px: 4,
              background:
                'linear-gradient(135deg,#7b61ff,#9c27b0)',

              '&:hover': {
                background:
                  'linear-gradient(135deg,#6949ff,#8e24aa)',
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;