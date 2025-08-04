import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App.tsx"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./assets/css/style.css";

import "./assets/css/bootstrap-custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import {Settings} from "luxon";
import Helmet from "react-helmet";

Settings.defaultZone = "Europe/Prague";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 15 * 60 * 1000,
            refetchInterval: 15 * 60 * 1000
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Helmet>
                <script src="https://analytics.matousvolf.cz/script.js"
                        data-website-id="a807ef9a-d4b3-4e0b-bee3-2cec07d6e39f" data-domains="rozvrh.matousvolf.cz"
                        defer></script>
            </Helmet>
            <App/>
        </QueryClientProvider>
    </React.StrictMode>
)
