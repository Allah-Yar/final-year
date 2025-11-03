import React from "react";
import { Container, Box, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        // background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        color: "#fff",
        py: 4,
        mt: 5,
        textAlign: "center",
        boxShadow: "0 -5px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Container>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Fake Currency Detection System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          Ensuring authenticity through AI-powered detection.
        </Typography>

        <Box>
          {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
            <IconButton key={index} sx={{ color: "#fff", mx: 1 }}>
              <Icon fontSize="medium" />
            </IconButton>
          ))}
        </Box>

        <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
          © {new Date().getFullYear()} Fake Currency Detection System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

