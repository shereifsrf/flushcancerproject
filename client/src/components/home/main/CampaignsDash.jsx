import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { campaigns } from "../../../dummyData";
import { CardActions, LinearProgress, Divider, Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { CAMPAIGNS_URL } from "../../../constants";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    desc: {
        maxHeight: 100,
        overflow: "auto",
    },
    cardMedia: {
        paddingTop: "56.25%", // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    donationSec: {
        justify: "flex-end",
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

const cards = campaigns;

export default function Album() {
    const history = useHistory();
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.heroContent}>
                <Container maxWidth="sm">
                    <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                    >
                        Campaigns List
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        color="textSecondary"
                        paragraph
                    >
                        Here are your Campaigns. Please view or edit as you wish
                    </Typography>
                </Container>
            </div>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {cards.map((card) => (
                        <Grid item key={card.id} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image="https://www.healthxchange.sg/sites/hexassets/Assets/children/childhood-cancer-facts-and-symptoms.jpg"
                                    title="Image title"
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h5" component="h2">
                                        {card.name}
                                    </Typography>
                                    <Typography className={classes.desc}>
                                        {card.description}
                                    </Typography>
                                    <Divider className={classes.divider} />

                                    <Grid className={classes.donationSec}>
                                        <Typography variant="body2">
                                            Donation Status:
                                        </Typography>

                                        <LinearProgress
                                            variant="determinate"
                                            value={
                                                (card["total-donated"] /
                                                    card.limit) *
                                                100
                                            }
                                        />
                                        <Grid container justify="space-between">
                                            <Grid>
                                                <Typography variant="body2">
                                                    Donated:
                                                    {card["total-donated"]}
                                                </Typography>
                                            </Grid>
                                            <Grid>
                                                <Typography variant="body2">
                                                    Limit: {card.limit}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            history.push(
                                                `/${CAMPAIGNS_URL}/${card.id}`
                                            )
                                        }
                                    >
                                        View
                                    </Button>
                                    <Button size="small" color="primary">
                                        Edit
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </React.Fragment>
    );
}
