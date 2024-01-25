import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App.tsx"
import {CookiesProvider} from "react-cookie";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ReactGA from "react-ga4";
import "./css/style.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Settings} from "luxon";

Settings.defaultZone = "Europe/Prague";
const queryClient = new QueryClient();
ReactGA.initialize("G-60HTHGY4JH");

const cookieExpirationDate = new Date();
cookieExpirationDate.setMonth(6);
cookieExpirationDate.setDate(28);

if (new Date() > cookieExpirationDate) {
    cookieExpirationDate.setFullYear(cookieExpirationDate.getFullYear() + 1);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CookiesProvider defaultSetOptions={{expires: cookieExpirationDate}}>
                <App/>
            </CookiesProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
