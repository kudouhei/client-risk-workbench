import { getClientRiskReviews } from "@/lib/api";

export default async function HomePage() {
  const reviews = await getClientRiskReviews();

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "48px auto",
        padding: 24,
      }}
    >
      <h1>Client Risk &amp; Compliance Workbench</h1>

      <p>
        Loaded {reviews.length} client risk reviews from FastAPI.
      </p>

      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            {review.legal_name} — {review.risk_rating} —{" "}
            {review.review_status}
          </li>
        ))}
      </ul>
    </main>
  )
}