

import React from "react";
import { 
  Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider 
} from "@mui/material";

const Instructions = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 20, mb: 6, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 15,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            // borderRadius: 3,
            // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            // boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ fontWeight: "bold", color: "#E3F2FD", textAlign: "center" }}
          >
            How to Use
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ color: "#BBDEFB", textAlign: "center", mb: 2 }}
          >
            Follow these simple steps to get started:
          </Typography>

          <List sx={{ pl: 2 }}>
            {[
              "Upload your image using the Choose File button on the Check page.",
              "Wait for the model to process your image.",
              "View the results and predictions displayed on the screen.",
              "You can upload another image to get new predictions."
            ].map((step, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText 
                    primaryTypographyProps={{ fontSize: 16, fontWeight: 500,  color: "#BBDEFB", }}
                    primary={`${index + 1}. ${step}`} 
                  />
                </ListItem>
                {index !== 3 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Typography 
            variant="body2" 
            sx={{ mt: 3, textAlign: "center", fontWeight: 500, color: "#444" }}
          >
            <strong>Note:</strong> Supported formats: <b>JPG, JPEG, PNG.</b>  
            Ensure the image is clear and well-lit for better accuracy.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Instructions;

