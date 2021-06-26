import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import DonationsDash from "./DonationsDash";
import CampaignsDash from "./CampaignsDash";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
}));

export default function Album() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.root}>
        <Grid container spacing={3}>
          <Grid item md={12} lg={8}>
            <CampaignsDash />
          </Grid>
          <Grid item lg={4}>
            <DonationsDash />
          </Grid>
        </Grid>
      </main>
    </React.Fragment>
  );
}
