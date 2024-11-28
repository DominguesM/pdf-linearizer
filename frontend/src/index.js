import React from 'react';
import { createRoot } from 'react-dom/client';
import "./tailwind.css";
import App from "./App";

const meta = document.createElement("meta");
meta.httpEquiv = "Content-Security-Policy";
meta.content = "worker-src 'self' blob: https://cdnjs.cloudflare.com;";
document.getElementsByTagName("head")[0].appendChild(meta);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);