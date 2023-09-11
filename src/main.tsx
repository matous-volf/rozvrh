import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import {CookiesProvider} from "react-cookie";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CookiesProvider defaultSetOptions={{expires: new Date("2100-01-01")}}>
                <App/>
            </CookiesProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
