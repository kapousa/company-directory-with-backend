// CompanyDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  CardMedia,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'https://admin-backend-1sev.onrender.com';

const CompanyDetails = ({ username, password, navigate }) => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/companies/${companyId}`, {
          auth: {
            username: username,
            password: password,
          },
        });
        setCompany(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyId, username, password]);

  const renderAboutUs = useCallback(() => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          About Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }} dangerouslySetInnerHTML={{ __html: company.description }} />

        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          Key Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Category: {company.category}</Typography>
            <Typography variant="body1">Size: {company.size}</Typography>
            <Typography variant="body1">Founded: {new Date(company.founded).toLocaleDateString()}</Typography>
            <Typography variant="body1">Headquarters: {company.headquarters}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Location: {company.location}</Typography>
            <Typography variant="body1">Employees: {company.employees}</Typography>
            <Typography variant="body1">Mission: <span dangerouslySetInnerHTML={{ __html: company.mission }} /></Typography>
            <Typography variant="body1">Values: {company.company_values.join(', ')}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          Financial Highlights
        </Typography>
        <Grid container spacing={2}>
          {company.financialStatement?.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="body1">
                {item.key}: <span dangerouslySetInnerHTML={{ __html: item.value }} />
              </Typography>
              {item.file && (
                <Typography variant="body2">
                  <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                    {item.file.filename}
                  </a>
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </>
    );
  }, [company]);

  const renderPortfolio = useCallback(() => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          Portfolio
        </Typography>
        {company.portfolio.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" component="div">
              {item.key}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.value }} />
            {item.file && (
              <Typography variant="body2">
                <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                  {item.file.filename}
                </a>
              </Typography>
            )}
          </div>
        ))}
      </>
    );
  }, [company]);

  const renderFinancialHighlights = useCallback(() => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
        Financial Highlights
        </Typography>
        {company.financialStatement.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" component="div">
              {item.key}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.value }} />
            {item.file && (
              <Typography variant="body2">
                <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                  {item.file.filename}
                </a>
              </Typography>
            )}
          </div>
        ))}
      </>
    );
  }, [company]);

  const renderInvestors = useCallback(() => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          Investors
        </Typography>
        {company.investors.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" component="div">
              {item.key}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.value }} />
            {item.file && (
              <Typography variant="body2">
                <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                  {item.file.filename}
                </a>
              </Typography>
            )}
          </div>
        ))}
      </>
    );
  }, [company]);

  const renderAssessment = useCallback(() => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          Assesment
        </Typography>
        {company.assessment.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" component="div">
              {item.key}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.value }} />
            {item.file && (
              <Typography variant="body2">
                <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                  {item.file.filename}
                </a>
              </Typography>
            )}
          </div>
        ))}
      </>
    );
  }, [company]);

  const renderTransformationPlan = useCallback(() => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          Assessment
        </Typography>
        {company.transformation_plan.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" component="div">
              {item.key}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.value }} />
            {item.file && (
              <Typography variant="body2">
                <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                  {item.file.filename}
                </a>
              </Typography>
            )}
          </div>
        ))}
      </>
    );
  }, [company]);

  const renderDynamicSection = useCallback((section) => {
    return (
      <>
        <Typography variant="h5" component="div" sx={{ mt: 3, mb: 1 }}>
          {section.key}
        </Typography>
        {section.value.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" component="div">
              {item.key}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item.value }} />
            {item.file && (
              <Typography variant="body2">
                <a href={item.file.file_url} target="_blank" rel="noopener noreferrer">
                  {item.file.filename}
                </a>
              </Typography>
            )}
          </div>
        ))}
      </>
    );
  }, []);

  useEffect(() => {
    if (company) {
      const newTabs = [
        { label: 'About Us', content: renderAboutUs() },
      ];

      if (company.portfolio) {
        newTabs.push({ label: 'Portfolio', content: renderPortfolio() });
      }
      if (company.financialStatement) {
        newTabs.push({ label: 'Financial Highlights', content: renderFinancialHighlights() });
      }
      if (company.assessment) {
        newTabs.push({ label: 'Assesment', content: renderAssessment() });
      }
      if (company.investors) {
        newTabs.push({ label: 'Investors', content: renderInvestors() });
      }

      {/*
        if (company.transformation_plan) {
        newTabs.push({ label: 'Assesment', content: renderTransformationPlan() });
      }
      */}

      if (company.dynamicSections && company.dynamicSections.length > 0) {
        company.dynamicSections.forEach((section) => {
          newTabs.push({ label: section.key, content: renderDynamicSection(section) });
        });
      }

      setTabs(newTabs);
    }
  }, [company, renderAboutUs, renderAssessment, renderInvestors, renderPortfolio, renderFinancialHighlights, renderTransformationPlan, renderDynamicSection]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (company) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/directory')} sx={{ mb: 2 }}>
          Back to Directory
        </Button>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
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
              image={company.logo}
              alt={company.name}
            />
            <Typography variant="h3" component="div">
              {company.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Innovating for a Better Future
            </Typography>
            <Button
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Visit Our Website
            </Button>
          </Box>

          <Tabs value={activeTab} onChange={handleTabChange} aria-label="company tabs">
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>

          {tabs[activeTab]?.content}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" size="large">
              Contact Us
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  return null;
};

export default CompanyDetails;