import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App.tsx"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ReactGA from "react-ga4";
import "./css/style.css";

import "./css/bootstrap-custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import {Settings} from "luxon";

Settings.defaultZone = "Europe/Prague";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 15 * 60 * 1000,
            refetchInterval: 15 * 60 * 1000
        },
    },
});
ReactGA.initialize("G-60HTHGY4JH");

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
    </React.StrictMode>,
)
