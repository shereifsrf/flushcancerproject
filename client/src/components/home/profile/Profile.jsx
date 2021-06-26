import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import { campaigns } from "../../../dummyData";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  form: {
    marginTop: theme.spacing(8),
    "& > *": {
      marginTop: theme.spacing(2),
      width: "100%",
    },
  },
  buttons: {},
}));

const cards = campaigns;

export default function Profile() {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      {/* Hero unit */}
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Profile
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Edit profile fields
          </Typography>
        </Container>
        <Divider />
        <Container maxWidth="sm" align="center" className={classes.form}>
          <div>
            <TextField
              id="standard-read-only-input"
              fullWidth
              label="Full Name"
              defaultValue="Shereef"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div>
            <TextField
              id="standard-read-only-input"
              fullWidth
              label="Email"
              defaultValue="chachushereef@gmail.com"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className={classes.buttons}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="primary">
                  Edit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="secondary">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  );
}
