// ============================================================
// FILE:   frontend/src/main.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/theme.css";
import "./styles/layout.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "10px",
                background: "#0f172a",
                color: "#fff",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#2dd4bf", secondary: "#0f172a" },
              },
            }}
          />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
