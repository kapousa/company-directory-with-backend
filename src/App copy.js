import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import axios from 'axios';
import CompanyDetails from './CompanyDetails';

const DESCRIPTION_PREVIEW_LENGTH = 150;
const API_BASE_URL = 'http://127.0.0.1:8000';

const categories = [
  'Technology',
  'Food & Beverage',
  'Environmental',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Manufacturing',
  'Energy',
  'Transportation',
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companiesData, setCompaniesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const isFetching = useRef(false);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/companies/`, {
        params: {
          search: searchTerm,
          category: filterCategory,
          size: filterSize,
          location: filterLocation,
          limit: 10,
        },
      });
      setCompaniesData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterSize, filterLocation]);

  const loadMoreData = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/companies/`, {
        params: {
          search: searchTerm,
          category: filterCategory,
          size: filterSize,
          location: filterLocation,
          skip: companiesData.length,
          limit: 20,
        },
      });
      setCompaniesData([...companiesData, ...response.data]);
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [companiesData, searchTerm, filterCategory, filterSize, filterLocation]);

  useEffect(() => {
    loadInitialData();
  }, [searchTerm, filterCategory, filterSize, filterLocation, loadInitialData]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching.current) {
          setLoading(true);
          loadMoreData();
        }
      },
      { threshold: 1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [companiesData, loadMoreData]);

  const handleCompanyClick = async (company) => {
    try {
      const url = `${API_BASE_URL}/companies/${company._id}`; // Correct URL construction
      console.log("URL being sent:", url); // Add this line for debugging
      const response = await axios.get(url);
      setSelectedCompany(response.data);
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
      // ... (error handling)
    }
  };

  const handleBack = () => {
    setSelectedCompany(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/directory"
          element={
            selectedCompany ? (
              <Container maxWidth="md" sx={{ mt: 4 }}>
                <CompanyDetails selectedCompany={selectedCompany} handleBack={handleBack} />
              </Container>
            ) : (
              <Container maxWidth="md" sx={{ mt: 4 }}>
                <>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Company Directory
                  </Typography>
  
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Search companies..."
                      variant="outlined"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Select
                          fullWidth
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Select
                          fullWidth
                          value={filterSize}
                          onChange={(e) => setFilterSize(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Select Size</MenuItem>
                          <MenuItem value="Small">Small</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Large">Large</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Select
                          fullWidth
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Select Location</MenuItem>
                          <MenuItem value="San Francisco, CA">San Francisco, CA</MenuItem>
                          <MenuItem value="New York, NY">New York, NY</MenuItem>
                          <MenuItem value="London, UK">London, UK</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </Box>
  
                  <Grid container spacing={3} ref={scrollRef}>
                    {companiesData.map((company) => (
                      <Grid item xs={12} sm={6} md={4} key={company._id}>
                        <Card onClick={() => handleCompanyClick(company)} sx={{ cursor: 'pointer', height: '100%' }}>
                          <CardMedia
                            component="img"
                            sx={{ width: '100%', height: 150, objectFit: 'contain' }}
                            image={company.logo}
                            alt={company.name}
                          />
                          <CardContent>
                            <Typography variant="h6" component="div">
                              {company.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Category: {company.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Size: {company.size}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Location: {company.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Revenue: ${company.financialStatement.revenue}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Description: {company.description.substring(0, DESCRIPTION_PREVIEW_LENGTH)}...
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item xs={12} ref={sentinelRef}>
                    <div style={{ height: '20px' }}></div>
                  </Grid>
                  {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <CircularProgress />
                    </Box>
                  )}
                </>
              </Container>
            )
          } // Added the closing parenthesis here!
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;