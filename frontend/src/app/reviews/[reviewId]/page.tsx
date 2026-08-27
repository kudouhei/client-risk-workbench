import { notFound } from "next/navigation";

import { ClientRiskReviewDetails,} from "@/components/client-risk-review-details";
import { getClientRiskReview, getClientRiskReviewStatusEvents } from "@/lib/api";

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

  const [review, statusEvents] = await Promise.all([
    getClientRiskReview(reviewId),
    getClientRiskReviewStatusEvents(reviewId),
  ]);
  
  if (
    review === null ||
    statusEvents === null
  ) {
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
      <ClientRiskReviewDetails review={review} statusEvents={statusEvents} />
    </main>
  );
}