import React, { useLayoutEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { PER_PAGE_VALUE } from "../../../constants";
import { useLocation } from "react-router-dom";
import { clearStatus, getCampaignList } from "../../../api";
import { useAuthContext } from "../../AuthProvider";
import { isEmpty } from "lodash";
import { useDashContext } from "../DashProvider";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            marginTop: theme.spacing(2),
        },
    },
}));

const initData = {
    page: 1,
    total: 0,
    perPage: PER_PAGE_VALUE,
};

export default function PaginationCampaign(props) {
    const classes = useStyles();
    const query = useQuery();
    const [data, setData] = useState(initData);
    const { state, dispatch } = useAuthContext();
    const { data: dashData, setData: setDashData } = useDashContext();
    const search = query.get("search");
    const perPage = parseInt(query.get("perPage"));
    const page = parseInt(query.get("page"));

    const handleChange = (_, value) => {
        if (data.page !== value) {
            setDashData({ ...dashData, trigger: true });
        }
        setData({ ...data, page: value });
    };

    useLayoutEffect(() => {
        setDashData({ ...dashData, trigger: true });
    }, []);

    useLayoutEffect(() => {
        if (dashData.trigger) {
            clearStatus(dispatch);
            let query = {};

            query.page = page ? page : data.page;

            query.perPage = perPage ? perPage : data.perPage;

            if (!isEmpty(search)) {
                query.search = search;
            } else if (dashData.search !== "") {
                query.search = dashData.search;
            }

            if (dashData.category !== "") {
                query.categoryId = dashData.category;
            }

            if (dashData.minLimit !== "") {
                query.minLimit = dashData.minLimit;
            }

            if (dashData.maxLimit !== "") {
                query.maxLimit = dashData.maxLimit;
            }

            getCampaignList(props.dashboard, dispatch, query);
            setData({ ...data, page: query.page, perPage: query.perPage });
            setDashData({ ...dashData, loading: true, trigger: false });
        }
    }, [dashData.trigger]);

    useLayoutEffect(() => {
        if (dashData.loading) {
            if (state.status.getCampaignListSuccess) {
                setData({
                    ...data,
                    page: isEmpty(state.campaigns) ? 1 : data.page,
                    total: Math.ceil(state.totalCampaigns / data.perPage),
                });

                if (
                    data.page > Math.ceil(state.totalCampaigns / data.perPage)
                ) {
                    setDashData({ ...dashData, trigger: true });
                } else {
                    setDashData({ ...dashData, loading: false });
                }
                window.scrollTo(0, 0);
            } else if (state.status.getCampaignListFailed) {
                setData(initData);
                setDashData({ ...dashData, loading: false });
                window.scrollTo(0, 0);
            }
        }
    }, [state]);

    return (
        <div className={classes.root}>
            {!!data.total && (
                <Pagination
                    count={data.total}
                    color="primary"
                    page={data.page}
                    onChange={handleChange}
                />
            )}
        </div>
    );
}
