import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
            // position: 'absolute',
          background: "linear-gradient(135deg, #0d1321 0%, #1d3557 50%, #546e7a 100%)",
          width: "100vw",
             
          
        //   boxSizing: "border-box",
          top: 0,
          left: 0,
          zIndex: -1,
        },
      },
    },
  },
});

export default theme;
