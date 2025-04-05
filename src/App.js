import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Pagination,
  CircularProgress,
  Button,
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import axios from 'axios';
import CompanyDetails from './CompanyDetails';

const API_BASE_URL = 'https://admin-backend-1sev.onrender.com';

const categories = [
  'Technology',
  'Retail',
  'Health Care',
  'Finance',
  'Manufacturing',
  'Education',
  'Hospitality',
  'Transportation',
  'Energy',
  'Agriculture',
];

const sizes = [
  "Less than 50 employees",
  "51 - 100 employees",
  "101 - 500 employees",
  "501 - 1000 employees",
  "1001 - 10000employees",
  "More than 10000 employees"
];

const locations = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'China',
  'India',
  'Brazil',
  'Australia',
  'South Africa',
  'Nigeria',
  'Mexico',
  'Russia',
  'Italy',
  'Spain',
  'Netherlands',
  'Switzerland',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Singapore',
  'South Korea',
  'Argentina',
  'Turkey',
  'Indonesia',
  'Saudi Arabia',
  'Egypt',
  'Thailand',
  'Vietnam',
  'Malaysia',
  'Philippines',
  'Pakistan',
  'Bangladesh',
  'Ireland',
  'Portugal',
  'Austria',
  'Belgium',
  'Poland',
  'Hungary',
  'Czech Republic',
  'Greece',
  'Romania',
  'Ukraine',
  'United Arab Emirates',
  'Kuwait',
  'Qatar',
  'New Zealand',
  'Chile',
  'Colombia',
  'Peru',
  'Morocco',
  'Algeria',
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [companiesData, setCompaniesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const COMPANIES_PER_PAGE = 9;
  const [totalCompanies, setTotalCompanies] = useState(0);

  const username = 'admin';
  const password = 'password';

  const fetchData = useCallback(async (pageToLoad) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/companies/`, {
        params: {
          search: searchTerm,
          category: filterCategory,
          size: filterSize,
          location: filterLocation,
          limit: COMPANIES_PER_PAGE,
          skip: (pageToLoad - 1) * COMPANIES_PER_PAGE,
        },
        auth: {
          username: username,
          password: password,
        },
      });
      setCompaniesData(response.data);
      setTotalCompanies(response.headers['x-total-count']);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterSize, filterLocation]);

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  function CompanyDetailsWrapper() {
    const navigate = useNavigate();
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <CompanyDetails username={username} password={password} navigate={navigate} />
      </Container>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/directory"
          element={
            <Container maxWidth="md" sx={{ mt: 4 }}>
              <>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" sx={{ mb: 2 }}>
                    Home
                  </Button>
                </Link>
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
                        {sizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Select
                        fullWidth
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Company Location</MenuItem>
                        {locations.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={3}>
                  {companiesData.map((company) => (
                    <Grid item xs={12} sm={6} md={4} key={company.id}>
                      <Link to={`/company/${company.id}`} style={{ textDecoration: 'none' }}>
                        <Card sx={{ cursor: 'pointer', height: '100%' }}>
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
                              Revenue: ${company.revenue}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div">
                              <div dangerouslySetInnerHTML={{ __html: company.description }} />
                            </Typography>
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
                {totalCompanies > COMPANIES_PER_PAGE && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(totalCompanies / COMPANIES_PER_PAGE)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                  </Box>
                )}
              </>
            </Container>
          }
        />
        <Route path="/company/:companyId" element={<CompanyDetailsWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;