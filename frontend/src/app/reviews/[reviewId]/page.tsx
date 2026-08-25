import { notFound } from "next/navigation";

import { ClientRiskReviewDetails,} from "@/components/client-risk-review-details";
import { getClientRiskReview } from "@/lib/api";

type ClientRiskReviewPageProps = {
  params: Promise<{
    reviewId: string;
  }>;
};

export default async function ClientRiskReviewPage({
  params,
}: ClientRiskReviewPageProps) {
  const { reviewId: reviewIdParameter } = await params;
  const reviewId = Number(reviewIdParameter);

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    notFound();
  }

  const review = await getClientRiskReview(reviewId);

  if (review === null) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "48px auto",
        padding: 24,
      }}
    >
      <ClientRiskReviewDetails review={review} />
    </main>
  );
}