import React, { useState, useEffect, useRef } from 'react';
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
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import routing components
import LandingPage from './LandingPage'; // Import LandingPage

const DESCRIPTION_PREVIEW_LENGTH = 150;

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

  useEffect(() => {
    loadInitialData();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreData();
        }
      },
      { threshold: 1 }
    );
  
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [searchTerm, filterCategory, filterSize, filterLocation, loading]); // Added loading as dependency

  const loadInitialData = () => {
    setLoading(true);
    setTimeout(() => {
      const initialData = Array.from({ length: 10 }, (_, i) => generateDummyCompany(i));

      // Apply filters to initial data
      const filteredInitialData = initialData.filter((company) => {
        const nameMatch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        let categoryMatch = true;
        let sizeMatch = true;
        let locationMatch = true;

        if (filterCategory) {
          categoryMatch = company.category === filterCategory;
        }
        if (filterSize) {
          sizeMatch = company.size === filterSize;
        }
        if (filterLocation) {
          locationMatch = company.location === filterLocation;
        }

        return nameMatch && categoryMatch && sizeMatch && locationMatch;
      });

      setCompaniesData(filteredInitialData); // Update with filtered data
      setLoading(false);
    }, 1000);
  };

  const loadMoreData = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newData = Array.from({ length: 10 }, (_, i) => generateDummyCompany(companiesData.length + i));
      const combinedData = [...companiesData, ...newData];

      const filteredCombinedData = combinedData.filter((company) => {
        const nameMatch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        let categoryMatch = true;
        let sizeMatch = true;
        let locationMatch = true;

        if (filterCategory) {
          categoryMatch = company.category === filterCategory;
        }
        if (filterSize) {
          sizeMatch = company.size === filterSize;
        }
        if (filterLocation) {
          locationMatch = company.location === filterLocation;
        }

        return nameMatch && categoryMatch && sizeMatch && locationMatch;
      });

      setCompaniesData(filteredCombinedData);
      setLoading(false);
    }, 1000);
  };

  const generateDummyCompany = (index) => ({
    id: index + 1,
    name: `Company ${index + 1}`,
    category: categories[index % categories.length],
    size: ['Small', 'Medium', 'Large'][index % 3],
    location: ['San Francisco, CA', 'New York, NY', 'London, UK'][index % 3],
    employees: Math.floor(Math.random() * 1000),
    description: `Company ${index + 1} is a dynamic...`,
    logo: require(`./logos/${index % 5 + 1}.jpg`),
    website: `https://company${index + 1}.com`,
    financialStatement: {
      revenue: Math.floor(Math.random() * 1000000),
      profit: Math.floor(Math.random() * 500000),
      assets: Math.floor(Math.random() * 2000000),
      liabilities: Math.floor(Math.random() * 1000000),
    },
    founded: `${1980 + (index % 40)}-01-01`,
    headquarters: ['San Francisco', 'New York', 'London', 'Tokyo'][index % 4],
    mission: `Our mission is to lead innovation...`,
    values: ['Integrity', 'Innovation', 'Excellence', 'Collaboration'],
  });

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      if (
        window.innerHeight + scrollElement.getBoundingClientRect().top + window.scrollY >=
        scrollElement.offsetHeight + scrollElement.getBoundingClientRect().top &&
        !loading
      ) {
        loadMoreData();
      }
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const handleBack = () => {
    setSelectedCompany(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (selectedCompany) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Directory
        </Button>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {/* Hero Section (Logo and Name) - Moved outside tabs */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
              textAlign: 'center',
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 150, height: 150, objectFit: 'contain', mb: 1 }}
              image={selectedCompany.logo}
              alt={selectedCompany.name}
            />
            <Typography variant="h3" component="div">
              {selectedCompany.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Innovating for a Better Future
            </Typography>
            <Button
              href={selectedCompany.website}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Visit Our Website
            </Button>
          </Box>

          <Tabs value={activeTab} onChange={handleTabChange} aria-label="company tabs">
            <Tab label="About Us" />
            <Tab label="Porfolio" />
            <Tab label="Investors" />
            <Tab label="Assessment" />
            <Tab label="Transformation Plan" />
          </Tabs>

          {activeTab === 0 && (
            <>
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                About Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedCompany.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Key Features:
                <ul>
                  <li>Cutting-edge solutions</li>
                  <li>Dedicated team</li>
                  <li>Sustainable practices</li>
                </ul>
              </Typography>

              {/* Key Information Section (Moved inside About Us tab) */}
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                Key Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Category: {selectedCompany.category}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Size: {selectedCompany.size}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Founded: {selectedCompany.founded}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Headquarters: {selectedCompany.headquarters}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Location: {selectedCompany.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Employees: {selectedCompany.employees}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Mission: {selectedCompany.mission}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Values: {(selectedCompany.values || []).join(', ')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Financial Information Section (Moved inside About Us tab) */}
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                Financial Highlights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">Revenue: ${selectedCompany.financialStatement.revenue}</Typography>
                  <Typography variant="body1">Profit: ${selectedCompany.financialStatement.profit}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">Assets: ${selectedCompany.financialStatement.assets}</Typography>
                  <Typography variant="body1">Liabilities: ${selectedCompany.financialStatement.liabilities}</Typography>
                </Grid>
              </Grid>
            </>
          )}

          {/* ... (Careers, Investors, Assessment, Transformation Plan tabs) */}

          {activeTab === 2 && (
            <>
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                Investors
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Welcome to our investor relations page.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Key Investor Highlights:
                <ul>
                  <li>Annual Report 2023 - Download <a href="/investors/annual-report-2023">here</a></li>
                  <li>Financial Results Q4 2023 - View <a href="/investors/financial-results-q4-2023">here</a></li>
                  <li>Investor Presentations - Access <a href="/investors/presentations">here</a></li>
                </ul>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Contact Investor Relations: <a href="mailto:investors@company.com">investors@company.com</a>
              </Typography>
            </>
          )}

          {activeTab === 3 && (
            <>
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                Assessment
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our company undergoes regular assessments to ensure continuous improvement.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Key Assessment Findings:
                <ul>
                  <li>Strong market position in the technology sector.</li>
                  <li>Opportunities for improvement in customer satisfaction.</li>
                  <li>Commitment to sustainability and environmental responsibility.</li>
                </ul>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Assessment Reports:
                <ul>
                  <li>Sustainability Report - Download <a href="/assessment/sustainability-report">here</a></li>
                  <li>Customer Satisfaction Report - Download <a href="/assessment/customer-satisfaction-report">here</a></li>
                </ul>
              </Typography>
            </>
          )}

          {activeTab === 1 && ( // Portfolio Tab
            <>
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                Portfolio
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our portfolio showcases our diverse projects and achievements.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Featured Projects:
                <ul>
                  <li>Project A - View Details <a href="/portfolio/project-a">here</a></li>
                  <li>Project B - View Details <a href="/portfolio/project-b">here</a></li>
                  <li>Project C - View Details <a href="/portfolio/project-c">here</a></li>
                </ul>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Client Success Stories:
                <ul>
                  <li>Client X - Read Story <a href="/portfolio/client-x">here</a></li>
                  <li>Client Y - Read Story <a href="/portfolio/client-y">here</a></li>
                </ul>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                View our complete portfolio: <a href="/portfolio">here</a>
              </Typography>
            </>
          )}

          {activeTab === 4 && (
            <>
              <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
                Transformation Plan
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our strategic transformation plan is focused on innovation and growth, divided into clear phases.
              </Typography>

              <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                Planning
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                In the planning phase, we conducted thorough market research, defined clear objectives, and established key performance indicators (KPIs). This phase involved:
                <ul>
                  <li>Market analysis and competitive benchmarking</li>
                  <li>Strategic goal setting and resource allocation</li>
                  <li>Development of a detailed project roadmap</li>
                </ul>
              </Typography>

              <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                Execution
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The execution phase focused on implementing the planned initiatives. This included:
                <ul>
                  <li>Team formation and role assignments</li>
                  <li>Development of new technologies and systems</li>
                  <li>Pilot testing and iterative improvements</li>
                </ul>
              </Typography>

              <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                Monitoring
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We continuously monitored progress against our KPIs and made necessary adjustments. This phase involved:
                <ul>
                  <li>Regular progress meetings and status reports</li>
                  <li>Data analysis and performance tracking</li>
                  <li>Risk assessment and mitigation</li>
                </ul>
              </Typography>

              <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
                Release
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The release phase marked the successful completion and deployment of our transformation plan. This included:
                <ul>
                  <li>Final testing and quality assurance</li>
                  <li>Rollout and user training</li>
                  <li>Post-implementation reviews and feedback collection</li>
                </ul>
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Transformation Plan Document - Download <a href="/transformation-plan/document">here</a>
              </Typography>
            </>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" size="large">
              Contact Us
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/directory" element={
          <Container maxWidth="md" sx={{ mt: 4 }}>
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
                    <MenuItem value="">Select Category</MenuItem> {/* Placeholder */}
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
                    <MenuItem value="">Select Size</MenuItem> {/* Placeholder */}
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
                    <MenuItem value="">Select Location</MenuItem> {/* Placeholder */}
                    <MenuItem value="San Francisco, CA">San Francisco, CA</MenuItem>
                    <MenuItem value="New York, NY">New York, NY</MenuItem>
                    <MenuItem value="London, UK">London, UK</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={3} ref={scrollRef}>
              {companiesData.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.id}>
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
          </Container>
        }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>

  );

}

export default App;