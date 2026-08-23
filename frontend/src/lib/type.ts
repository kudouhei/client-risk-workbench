export type RiskRating = "Low" | "Medium" | "High";

export type ReviewStatus = "Approved" | "In Review" | "Escalated";

export type ClientRiskReview = {
    id: number;
    legal_name: string;
    client_type: string;
    country_code: string;
    risk_rating: RiskRating;
    review_status: ReviewStatus;
    next_review_date: string;
    created_at: string;
  };