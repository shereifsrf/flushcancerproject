import React from "react";
import {
  CssBaseline,
  Box,
  Grid,
  Container,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Button,
  Link,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BG from "../../../images/island1.jpg";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ShareIcon from "@material-ui/icons/Share";
import { campaigns } from "../../../dummyData";
import { Link as RouterLink, useParams } from "react-router-dom";
import { limitCharWithDots } from "../../../util";

const useStyles = makeStyles((theme) => ({
  root: {},
  img: {
    height: 250,
  },
  donationField: {
    width: 200,
  },
  sideMain: {
    display: "flex",
    flexDirection: "column",
  },
  interact: {
    "& *": {
      marginRight: 50,
    },
  },
  bottomSec: {
    backgroundColor: "#eceff1",
    marginTop: 50,
    padding: 20,
  },
  similarSec: { paddingLeft: 50 },
}));

export default function CampaignPublic() {
  const { campaignId } = useParams();
  const campaign = campaigns.find((c) => c.id === parseInt(campaignId));
  const campaign3 = campaigns.filter((c) => c.id !== parseInt(campaignId));
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box component="h1">{campaign.name}</Box>
        <Grid container className={classes.root}>
          <Grid item sm={12} md={7}>
            <Box>
              <img className={classes.img} src={BG} alt="campaign" />
            </Box>
          </Grid>
          <Grid item md={5} className={classes.sideMain}>
            <Box component="h3">Date: </Box>
            <Box component="h3">Donation Limit: ${campaign.limit}</Box>
            <Box display="flex" alignContent="flex-start">
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Donate
                  </InputLabel>
                  <OutlinedInput
                    type="number"
                    className={classes.donationField}
                    id="outlined-adornment-amount"
                    defaultValue="0"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    labelWidth={60}
                  />
                </FormControl>
              </Box>
              <Box display="flex" alignItems="center" marginLeft={2}>
                <Button variant="contained" color="primary" size="large">
                  Donate
                </Button>
              </Box>
            </Box>
            <Box height="100%" display="flex" alignItems="flex-end">
              <Box className={classes.interact}>
                <FavoriteBorderTwoToneIcon />
                <ShareIcon />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid container className={classes.bottomSec}>
          <Grid item md={7}>
            <Box component="h2">Description</Box>
            <Box>
              <Typography variant="body1">{campaign.description}</Typography>
            </Box>
          </Grid>
          <Grid item md={5}>
            <Box component="h2" className={classes.similarSec}>
              Similar
              {campaign3.map((c) => (
                <Box key={c.id} component="li" fontSize={20}>
                  <Link component={RouterLink} to={`/public-campaign/${c.id}`}>
                    {limitCharWithDots(c.name, 25)}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
