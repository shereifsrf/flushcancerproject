import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import { useAuthContext } from "../../AuthProvider";
import { useLayoutEffect } from "react";
import { createRating, getRating } from "../../../api";
import { Button, CircularProgress } from "@material-ui/core";

const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
};

const useStyles = makeStyles({
    root: {
        display: "flex",
        alignItems: "center",
    },
});

const initRating = {
    ratable: true,
    rating: 0,
    loading: false,
    id: "",
};

export default function CampaignRating({ campaignId }) {
    const [hover, setHover] = React.useState(-1);
    const [rating, setRating] = React.useState(initRating);
    const [value, setValue] = React.useState(0);
    const { state, dispatch } = useAuthContext();
    const classes = useStyles();
    const status = state.status;

    useLayoutEffect(() => {
        getRating(campaignId, dispatch);
        setRating({ ...rating, loading: true });
    }, []);

    useLayoutEffect(() => {
        if (rating.loading) {
            if (status.getRatingSuccess) {
                // console.log(state.rating);
                setRating({
                    ...rating,
                    rating: state.rating.rating,
                    ratable: state.rating.ratable,
                    loading: false,
                });
                setValue(state.rating.rating);
            } else if (status.createRatingSuccess) {
                console.log(state);
                setRating({
                    ...rating,
                    id: state.rating.id,
                    rating: state.rating.rating,
                    ratable: false,
                    loading: false,
                });
            }
        }
    }, [state]);

    const handleRating = (e) => {
        createRating({ campaignId, star: value }, dispatch);
        setRating({ ...rating, loading: true });
    };

    const getOtherAttributes = () => {
        return !rating.ratable ? { readOnly: true } : {};
    };

    return (
        <div className={classes.root}>
            <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
                {...getOtherAttributes()}
            />
            {rating.ratable && (
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleRating}
                >
                    Rate
                    {rating.loading && (
                        <>
                            {"  "} <CircularProgress size={20} />
                        </>
                    )}
                </Button>
            )}

            <Box pl={2}>{`Overall Rating: (${rating.rating})`}</Box>
            {/* <Box ml={2}>{labels[hover !== -1 ? hover : rating.rating]}</Box> */}
        </div>
    );
}
