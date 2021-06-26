import React from "react";
import { Typography, Link, Container } from "@material-ui/core";
import useStyles from "./footerStyles";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Flush Cancer Project
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Footer = () => {
  const classes = useStyles();

  return (
    <>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          {/* <Typography variant="body1">Add more links down here...</Typography> */}
          <Copyright />
        </Container>
      </footer>
    </>
  );
};

export default Footer;
