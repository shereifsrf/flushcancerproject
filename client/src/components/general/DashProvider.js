import React, { useContext, useState } from "react";

export const DashContext = React.createContext();

export function useDashContext() {
    return useContext(DashContext);
}

const initData = {
    loading: false,
    trigger: false,
    category: "",
    minLimit: 0,
    maxLimit: 0,
    search: "",
};

export default function DashProvider({ children }) {
    const [data, setData] = useState(initData);
    return (
        <DashContext.Provider value={{ data, setData, initData }}>
            {children}
        </DashContext.Provider>
    );
}
