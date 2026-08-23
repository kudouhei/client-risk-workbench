"use client";

import { Button, Result } from "antd";


type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};


export default function ErrorPage({
  reset,
}: ErrorPageProps) {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "48px auto",
        padding: 24,
      }}
    >
      <Result
        status="error"
        title="Unable to load client risk reviews"
        subTitle={
          "The API or database may be temporarily unavailable."
        }
        extra={
          <Button type="primary" onClick={reset}>
            Try again
          </Button>
        }
      />
    </main>
  );
}