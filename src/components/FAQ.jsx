import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
  Fade,
  Zoom,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const faqs = [
  {
    question: "How do I report a lost item?",
    answer: "To report a lost item, log in to your account, click on the 'Report' button in the navigation bar, and select 'Report Lost Item'. Fill out the form with as much detail as possible about your lost item, including when and where you last saw it, and any identifying features. You can also upload up to 5 images to help others identify your item."
  },
  {
    question: "How do I report a found item?",
    answer: "To report a found item, log in to your account, click on the 'Report' button in the navigation bar, and select 'Report Found Item'. Fill out the form with details about the item you found, including when and where you found it. Adding clear images will help the owner identify their item. Our system will automatically check for potential matches with reported lost items."
  },
  {
    question: "How does the matching system work?",
    answer: "Our matching system uses a combination of category matching and keyword analysis to identify potential matches between lost and found items. When you report a lost or found item, the system automatically checks for matches based on the item category, description, and other details. If a potential match is found, both parties will be notified and can communicate through our platform."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data privacy very seriously. Your personal information is only shared with other users when necessary to facilitate the return of lost items. We use secure authentication methods and encrypt sensitive data. You can control what information is shared in your profile settings."
  },
  {
    question: "How do I claim my lost item?",
    answer: "If someone reports finding an item that matches yours, you'll receive a notification. You can then view the details and contact the finder through our platform. To claim the item, you'll need to provide additional verification details that only the true owner would know. This helps prevent fraudulent claims."
  },
  {
    question: "What should I do if I can't find my item in the gallery?",
    answer: "If you don't see your item in the gallery, we recommend: 1) Refining your search terms, 2) Checking back regularly as new items are added daily, 3) Creating a lost item report so others can contact you if they find it, and 4) Setting up notifications for items matching your description."
  },
  {
    question: "How long are lost and found reports kept in the system?",
    answer: "Lost and found reports are kept in our system for 90 days by default. After this period, they are archived but can still be accessed if needed. If your item is still lost or unclaimed after 90 days, you can renew your report to keep it active in the main gallery."
  },
  {
    question: "Is there a fee for using this service?",
    answer: "No, our lost and found platform is completely free to use. We believe in helping people reconnect with their lost belongings without any financial barriers. The service is supported by our community and volunteers."
  }
];

const FAQ = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Fade in={true} timeout={800}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            Frequently Asked Questions
          </Typography>
        </Fade>
        
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Find answers to common questions about our Lost & Found platform
          </Typography>
        </Fade>
        
        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ mb: 2 }}>
              {faqs.map((faq, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: 2,
                    borderRadius: '12px !important',
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      backgroundColor: 'rgba(63, 81, 181, 0.05)',
                      '&.Mui-expanded': {
                        backgroundColor: 'rgba(63, 81, 181, 0.1)',
                      }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="500">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Still have questions?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Contact our support team at support@lostandfound.com
              </Typography>
            </Box>
          </Paper>
        </Zoom>
      </Box>
    </Container>
  );
};

export default FAQ; 