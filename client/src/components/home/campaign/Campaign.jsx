import React from "react";
import {
  CssBaseline,
  Container,
  Typography,
  Divider,
  TextField,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Button,
  Card,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CloudUpload } from "@material-ui/icons";
import { campaigns } from "../../../dummyData";
import { useParams } from "react-router-dom";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  root: {
    marginTop: theme.spacing(8),
  },
  form: {
    marginTop: theme.spacing(8),
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  input: {
    display: "none",
  },
}));

export default function Campaign() {
  const classes = useStyles();
  const { campaignId } = useParams();
  const campaign = campaigns.find((c) => c.id === parseInt(campaignId));
  return (
    <>
      <CssBaseline />
      <div className={classes.root}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            {campaign.name}
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            View/Edit the campaign here
          </Typography>
        </Container>
        <form noValidate autoComplete="off">
          <Container maxWidth="sm" className={classes.form}>
            <div>
              <TextField
                id="outlined-multiline-flexible"
                label="Name"
                multiline
                rowsMax={4}
                value={campaign.name}
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="standard-multiline-static"
                label="Decription"
                fullWidth
                multiline
                rows={4}
                value={campaign.description}
                variant="outlined"
              />
            </div>
            <div>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  startIcon={<CloudUpload />}
                  component="span"
                >
                  Upload Documents
                </Button>
              </label>
            </div>
            <div>
              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-amount">
                  Donation Limit
                </InputLabel>
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-amount"
                  defaultValue={campaign.limit}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  labelWidth={60}
                />
              </FormControl>
            </div>
            <Divider className={classes.divider} />
            <Grid container spacing={2} justify="space-between">
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                >
                  Save Changes
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="secondary">
                  Cancel Edit
                </Button>
              </Grid>
            </Grid>
          </Container>
        </form>
      </div>
    </>
  );
}
