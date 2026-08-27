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

export type ClientRiskReviewCreate = {
    legal_name: string;
    client_type: string;
    country_code: string;
    risk_rating: RiskRating;
    review_status: ReviewStatus;
    next_review_date: string;
  };

export type ClientRiskReviewStatusEvent = {
    id: number;
    client_risk_review_id: number;
    previous_status: ReviewStatus;
    new_status: ReviewStatus;
    changed_by: string;
    change_reason: string | null;
    changed_at: string;
};