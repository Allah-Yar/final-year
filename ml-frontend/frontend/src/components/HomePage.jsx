// Desc: Home page component for the frontend application
import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import {ReactTyped} from "react-typed";
import { Link } from "react-router-dom";
import PkrNote from "../assets/pakistani-rupees.jpg";

const FullWidthContainer = styled(Container)(({ theme }) => ({
  width: "100vw", // Full viewport width
  minHeight: "100vh",
  padding: 0,
  margin: 0,
  display: "flex",
  alignItems: "center",
  // background: "linear-gradient(135deg, #1a1b41 0%, #2e3b55 100%)",
  position: "relative",
  overflowX: "hidden", // Prevent horizontal scroll issues
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%", // Full width of the container
  padding: theme.spacing(4, 8),
  // Removed maxWidth: "1600px" to allow full stretch; re-add if you want a content cap
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    padding: theme.spacing(3, 4),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const TextContainer = styled(Box)(({ theme }) => ({
  flex: "0 0 50%",
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flex: "100%",
    paddingRight: 0,
    textAlign: "center",
    marginTop: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),

    
    
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  flex: "0 0 50%",
  display: "flex",
  justifyContent: "flex-end",
  
  [theme.breakpoints.down("md")]: {
    flex: "100%",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
}));

const StyledImage = styled("img")(({ theme }) => ({
  maxWidth: "100%",
  height: "auto",
  borderRadius: 8,
  // marginRight: theme.spacing(4),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: "70%",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "90%",
  },
}));

const ModernButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 6),
  borderRadius: 50,
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "1.1rem",
  // background: "linear-gradient(90deg, #4a90e2 0%, #63b3ed 100%)",
    background: "linear-gradient(90deg, #4a90e2 0%, #50bfa5 100%)",
  color: "white",
  boxShadow: "0 4px 15px rgba(74, 144, 226, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #357ab7 0%, #4299e1 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(74, 144, 226, 0.6)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 4),
    fontSize: "1rem",
  },
}));

const HomePage = () => {
  return (
    <FullWidthContainer disableGutters maxWidth={false}>
      <ContentWrapper>
        <TextContainer>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              letterSpacing: 1,
              lineHeight: 1.2,
              fontSize: "2.5rem",
              
              [theme => theme.breakpoints.down("md")]: {
                fontSize: "1rem",
                
                
              },
              [theme => theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
                fontWeight: 400,
                
                
              },
            }}
          >
            ML-Based Fake Currency Detection System
          </Typography>
         
{/* <Typography
  variant="h2"
  component="h1"
  sx={{
    color: "#ffffff",
    fontWeight: 700,
    letterSpacing: 1,
    lineHeight: 1.2,
    textAlign: "center",
    [theme => theme.breakpoints.down("md")]: {
      fontSize: "2.0rem",
    },
    [theme => theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem",
    },
  }}
>
Welcome to ML-Based Fake Currency Detection System
  {/* <span>
    <ReactTyped
      strings={[
        
        "Detect Fake Currency with AI!",
        "Secure & Fast Fake Note Detection",
      ]}
      typeSpeed={50}
      backSpeed={30}
      loop
    />
  </span> */}
{/* </Typography> */} 
          <Typography
            variant="h5"
            sx={{
              color: "#e2e8f0",
              marginTop: theme => theme.spacing(2),
              maxWidth: "500px",
              lineHeight: 1.6,
              [theme => theme.breakpoints.down("md")]: {
                margin: "0 auto",
                marginTop: theme => theme.spacing(2),
              },
              [theme => theme.breakpoints.down("sm")]: {
                fontSize: "1.1rem",
              },
            }}
          >
            A powerful platform for detecting PKR Notes whether it is fake or real.
          </Typography>
          <ModernButton component={Link} to="/check">
            Get Started
          </ModernButton>
        </TextContainer>
        <ImageContainer>
          <StyledImage src={PkrNote} alt="Machine Learning Visualization" />
        </ImageContainer>
      </ContentWrapper>
    </FullWidthContainer>
  );
};

export default HomePage;