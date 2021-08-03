import React, { useState, useLayoutEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import {
    Box,
    Button,
    Container,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@material-ui/core";
import { useAuthContext } from "../../AuthProvider";
import { getCategoryList } from "../../../api";
import { red } from "@material-ui/core/colors";
import { useDashContext } from "../../general/DashProvider";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    error: {
        color: red[500],
    },
    fullList: {
        width: "auto",
    },
});

const initData = {
    loading: false,
    categories: [
        { id: "asdasdasd", name: "asdadadsa" },
        { id: "asdadsadadadasd", name: "fghfhfghfgh" },
    ],
    hasError: false,
    errorMessage: "",
};

export default function DrawerFilter({ open, setOpen }) {
    const classes = useStyles();
    const { state, dispatch } = useAuthContext();
    const [drawer, setDrawer] = useState(open);
    const {
        data: dashData,
        setData: setDashData,
        initData: initDashData,
    } = useDashContext();
    const [data, setData] = useState(initData);

    useLayoutEffect(() => {
        setDrawer(open);
    }, [open]);

    useLayoutEffect(() => {
        if (data.loading) {
            if (state.status.getCategoryListSuccess) {
                // console.log(state.categories);
                setData({
                    ...data,
                    loading: false,
                    categories: state.categories,
                });
            } else if (state.status.getCategoryListFailed) {
                setData({ ...data, loading: false });
            }
        }
    }, [state]);

    useLayoutEffect(() => {
        getCategoryList(dispatch);
        setData({ ...data, loading: true });
    }, []);

    const toggleDrawer = (open) => {
        setDrawer(open);
        setOpen();
    };

    const handleChange = (e) => {
        setDashData({
            ...dashData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(dashData);

        if (
            !(data.minLimit < 0) ||
            (data.maxLimit !== 0 && data.minLimit > data.maxLimit)
        ) {
            setDashData({ ...dashData, trigger: true });
            toggleDrawer(false);
        } else {
            setData({
                ...data,
                hasError: true,
                errorMessage: "Validation error, please check fields",
            });
        }
    };

    const handleReset = () => {
        setDashData({ ...initDashData, trigger: true });
        toggleDrawer(false);
    };

    const list = () => (
        <form
            className={clsx(classes.list, classes.fullList)}
            role="presentation"
            onSubmit={handleSubmit}
        >
            <Container maxWidth="sm">
                <Box my={6}>
                    <Box>
                        <TextField
                            id="standard-multiline-static"
                            label="search"
                            name="search"
                            fullWidth
                            value={dashData.search}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Box>
                    <Box mt={2}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            // className={classes.formControl}
                        >
                            <InputLabel id="label-category">
                                Filter Category
                            </InputLabel>
                            <Select
                                labelId="label-category"
                                name="category"
                                value={dashData.category}
                                label="Select Category"
                                onChange={handleChange}
                            >
                                {data.categories.map((category) => {
                                    return (
                                        <MenuItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <FormControl
                            // fullWidth
                            // className={classes.margin}
                            variant="outlined"
                        >
                            <InputLabel>Min Donation Limit</InputLabel>
                            <OutlinedInput
                                type="number"
                                name="minLimit"
                                value={dashData.minLimit}
                                startAdornment={
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                }
                                labelWidth={60}
                                label="Donation Limit"
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl
                            // fullWidth
                            // className={classes.margin}
                            variant="outlined"
                        >
                            <InputLabel>Max Donation Limit</InputLabel>
                            <OutlinedInput
                                type="number"
                                name="maxLimit"
                                value={dashData.maxLimit}
                                startAdornment={
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                }
                                labelWidth={60}
                                label="Donation Limit"
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Box mr={2}>
                            <Button
                                color="secondary"
                                variant="outlined"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                            >
                                Apply
                            </Button>
                        </Box>
                    </Box>
                    {data.hasError && (
                        <span className={classes.error}>
                            {data.errorMessage}
                        </span>
                    )}
                </Box>
            </Container>
        </form>
    );

    return (
        <div>
            <Drawer
                anchor="top"
                open={drawer}
                onClose={() => toggleDrawer(false)}
            >
                {list()}
            </Drawer>
        </div>
    );
}
