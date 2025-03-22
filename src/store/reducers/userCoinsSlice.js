// userCoinsSlice.js
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";
import { apiCallBegan } from "../actions/apiActions";
import moment from "moment";
import { getUserCoinsApi } from "src/utils/api";

const initialState = {
    data: null,
    lastFetch: null,
    loading: false,
};

export const userCoinsSlice = createSlice({
    name: "UserCoins",
    initialState,
    reducers: {
        userCoinsRequested: (usercoins, action) => {
            usercoins.loading = true;
        },
        userCoinsSuccess: (usercoins, action) => {
            usercoins.data = action.payload.data;
            usercoins.loading = false;
            usercoins.lastFetch = Date.now();
        },
        userCoinsFailure: (usercoins, action) => {
            usercoins.loading = false;
        },
        clearReloadFlag: () => {
            sessionStorage.removeItem("firstLoad");
        }
    },
});

export const { userCoinsRequested, userCoinsSuccess, userCoinsFailure, clearReloadFlag } = userCoinsSlice.actions;
export default userCoinsSlice.reducer;

// API CALLS
export const loadUserCoinApi = ({
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    const firstLoad = sessionStorage.getItem("firstLoad");
    const manualRefresh = sessionStorage.getItem("manualRefresh");
    const lastFetchString = sessionStorage.getItem("lastFetch");
    const lastFetch = lastFetchString ? parseInt(lastFetchString) : null;

    const diffInMinutes = lastFetch ? moment().diff(moment(lastFetch), "minutes") : null;


    // Check if the data needs to be fetched
    const shouldFetchData = !firstLoad || manualRefresh === "true";

    if (shouldFetchData) {

        store.dispatch(
            apiCallBegan({
                ...getUserCoinsApi(),
                displayToast: false,
                onStartDispatch: userCoinsRequested.type,
                onSuccessDispatch: userCoinsSuccess.type,
                onErrorDispatch: userCoinsFailure.type,
                onStart,
                onSuccess: (res) => {
                    onSuccess(res);
                    sessionStorage.setItem("lastFetch", Date.now());
                },
                onError: (error) => {
                    onError(error);
                }
            })
        );

        // Clear manualRefresh flag
        sessionStorage.removeItem("manualRefresh");

        // Set firstLoad flag to prevent subsequent calls
        sessionStorage.setItem("firstLoad", "true");
    } else {
        onSuccess(store.getState().UserCoins); // Invoke onSuccess with the existing data
    }
};

// Helper function to check if the page has been manually refreshed
const isManualRefresh = () => {
    const manualRefresh = sessionStorage.getItem("manualRefresh");
    sessionStorage.removeItem("manualRefresh");
    return manualRefresh === "true";
};

// Event listener to set manualRefresh flag when page is manually refreshed
if (typeof window !== 'undefined') {
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("manualRefresh", "true");
    });

    window.addEventListener("load", () => {
        // Check if this is a manual refresh by checking if lastFetch is set
        if (!sessionStorage.getItem("lastFetch")) {
            sessionStorage.setItem("manualRefresh", "true");
        }
    });
}

// Selectors
export const userCoinsData = createSelector(
    (state) => state.UserCoins,
    (usercoins) => usercoins?.data
);
