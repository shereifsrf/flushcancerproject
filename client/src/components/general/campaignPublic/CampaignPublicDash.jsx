import { CssBaseline, Grid, makeStyles, Container } from "@material-ui/core";
import React from "react";
import CamapginCards from "./CamapignCards";
import { campaigns } from "../../../dummyData";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

export default function CampaignPublicDash() {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.root}>
        <Grid container spacing={2}>
          {campaigns.map((campaign) => (
            <Grid item key={campaign.id} sm={6} md={4} lg={3}>
              <CamapginCards campaign={campaign} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
