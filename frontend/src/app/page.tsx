import { getClientRiskReviews } from "@/lib/api";
import { ClientRiskTable } from "@/components/client-risk-table";

export default async function HomePage() {
  const reviews = await getClientRiskReviews();

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "48px auto",
        padding: 24,
      }}
    >
      <h1>Client Risk &amp; Compliance Workbench</h1>

      <p>
        Loaded {reviews.length} client risk reviews from FastAPI.
      </p>

      <ClientRiskTable reviews={reviews} />
    </main>
  );
}