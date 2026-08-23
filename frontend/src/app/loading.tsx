import { Card, Skeleton } from "antd";


export default function Loading() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "48px auto",
        padding: 24,
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <h1>Client Risk &amp; Compliance Workbench</h1>

      <p>Loading client risk reviews...</p>

      <Card>
        <Skeleton
          active
          title
          paragraph={{ rows: 5 }}
        />
      </Card>
    </main>
  );
}