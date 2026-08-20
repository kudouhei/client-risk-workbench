"use client";

import { Button, Card, Space } from "antd";
import { useState } from "react";

export function WorkbenchWelcome() {
    const [status, setStatus] = useState("Not started");

    return (
        <main style={{ maxWidth: 800, margin: "48px auto", padding: 24 }}>
        <h1>Client Risk &amp; Compliance Workbench</h1>
  
        <p>KYC/AML client risk review workspace</p>
  
        <Card title="Milestone 0">
          <Space>
            <p>
              Current status: <strong>{status}</strong>
            </p>
  
            <Button
              type="primary"
              onClick={() => setStatus("Frontend environment ready")}
            >
              Verify frontend
            </Button>
          </Space>
        </Card>
      </main>
    );
}