import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red, green } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { limitCharWithDots } from "../../../util";
import { LinearProgress, Box } from "@material-ui/core";
import { Link, useRouteMatch } from "react-router-dom";
import { useLayoutEffect } from "react";
import { isEmpty } from "lodash";
import { Buffer } from "buffer";
import { PUBLIC_CAMPAIGNS, CAMPAIGNS_URL } from "../../../constants";
import LockIcon from "@material-ui/icons/Lock";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    red: {
        backgroundColor: red[500],
    },
    green: {
        backgroundColor: green[500],
    },
    desc: {
        maxHeight: 100,
    },
    cardContent: {
        flexGrow: 1,
    },
    progress: {
        paddingBottom: theme.spacing(2),
    },
    link: {
        textDecoration: "none",
    },
}));

export default function CampaignCard({ campaign, dashboard }) {
    // console.log(campaign);
    const { url, path } = useRouteMatch();
    const [imgSrc, setImgSrc] = useState("");
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const progressVal =
        ((campaign["totalDonated"] || 0) / campaign.limit) * 100;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useLayoutEffect(() => {
        const document = campaign.document || null;
        const v = !isEmpty(document)
            ? `data:${document.contentType};base64,${new Buffer.from(
                  document.data
              ).toString("base64")}`
            : imgSrc.current;
        setImgSrc(v);
    }, []);
    return (
        <Card key={campaign.id} className={classes.card}>
            {/* <Link to={`${url}/${campaign.id}`} className={classes.link}> */}
            <Link
                to={`${dashboard ? CAMPAIGNS_URL : PUBLIC_CAMPAIGNS}/${
                    campaign.id
                }`}
                className={classes.link}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            aria-label="recipe"
                            className={
                                campaign.isVerified
                                    ? classes.green
                                    : classes.red
                            }
                        >
                            {campaign.isVerified ? (
                                <VerifiedUserIcon />
                            ) : (
                                <LockIcon />
                            )}
                        </Avatar>
                    }
                    // action={
                    //   <IconButton aria-label="settings">
                    //     <MoreVertIcon />
                    //   </IconButton>
                    // }
                    title={limitCharWithDots(campaign.name, 75)}
                    subheader="September 14, 2016"
                />
            </Link>
            <CardMedia component="img" src={imgSrc} alt="No Image" />
            <CardContent className={classes.cardContent}>
                <Typography variant="h5">{`${progressVal}% donated`}</Typography>
                <Box className={classes.progress}>
                    <LinearProgress
                        color="primary"
                        variant="determinate"
                        value={progressVal}
                    />
                </Box>
                <Typography className={classes.desc}>
                    {limitCharWithDots(campaign.description, 150)}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Description:</Typography>
                    <Typography paragraph>{campaign.description}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
