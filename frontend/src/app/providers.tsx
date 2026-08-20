"use client";

import { App, ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
    token: {
      colorPrimary: "#155eef",
      borderRadius: 8,
      fontSize: 14,
      fontFamily:
        "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
  };

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider theme={theme}>
            <App>{children}</App>
        </ConfigProvider>
    );
}