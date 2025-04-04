import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const FeaturedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const LandingPage = () => {
  const navigate = useNavigate();

  const featuredCompanies = [
    {
      id: 1,
      name: 'Tech Innovators Inc.',
      logo: 'logos/1.jpg', // Updated path
      description: 'Leading the way in software solutions.',
    },
    {
      id: 2,
      name: 'Green Energy Solutions',
      logo: 'logos/5.jpg', // Updated path
      description: 'Sustainable energy for a better future.',
    },
     {
      id: 3,
      name: 'Blue Energy Solutions',
      logo: 'logos/3.jpg', // Updated path
      description: 'Sustainable energy for a better future.',
    },
  ];

  const testimonials = [
    {
      quote: 'This directory has been invaluable for our business!',
      author: 'John Doe, CEO',
      companyLogo: 'logos/1.jpg', // Updated path
    },
    {
      quote: 'I found the exact company I was looking for!',
      author: 'Jane Smith, Manager',
      companyLogo: 'logos/2.jpg', // Updated path
    },
  ];

  return (
    <div>
      <HeroBox>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Leading Companies
          </Typography>
          <Typography variant="h5" gutterBottom>
            Explore a comprehensive directory of top companies in various industries.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/directory')}
          >
            Explore Companies
          </Button>
        </Container>
      </HeroBox>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          About Our Directory
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Our company directory provides a powerful platform to discover and connect with leading companies.
          With advanced filtering and detailed profiles, you can easily find the perfect partners or opportunities.
        </Typography>

        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mt: 6 }}>
          Featured Companies
        </Typography>
        <Grid container spacing={4}>
          {featuredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <FeaturedCard>
                <CardMedia
                  component="img"
                  height="140"
                  image={company.logo}
                  alt={company.name}
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {company.name}
                  </Typography>
                  <Typography variant="body2">{company.description}</Typography>
                </CardContent>
              </FeaturedCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mt: 6 }}>
          Testimonials
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ p: 3 }}>
                <Typography variant="body1" gutterBottom>
                  "{testimonial.quote}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar src={testimonial.companyLogo} alt="Company Logo" sx={{ mr: 2 }} />
                  <Typography variant="subtitle2">{testimonial.author}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Ready to explore?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/directory')}
          >
            Browse the Directory
          </Button>
        </Box>
      </Container>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: '#f0f0f0' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Company Directory. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default LandingPage;