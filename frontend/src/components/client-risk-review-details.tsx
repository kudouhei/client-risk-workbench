"use client";

import { Card, Descriptions, Space, Tag, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import Link from "next/link";

import type { ClientRiskReview, ClientRiskReviewStatusEvent, ReviewStatus, RiskRating } from "@/lib/type";
import { ReviewStatusControl } from "@/components/review-status-control";
import { ReviewStatusHistory } from "@/components/review-status-history";


const riskColours: Record<RiskRating, string> = {
    Low: "green",
    Medium: "gold",
    High: "red",
};
  
const statusColours: Record<ReviewStatus, string> = {
    Approved: "green",
    "In Review": "blue",
    Escalated: "red",
};

function formatCreatedAt(value: string): string {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(value));
  }
  
export function ClientRiskReviewDetails({review, statusEvents}: {review: ClientRiskReview, statusEvents: ClientRiskReviewStatusEvent[]}) {
    const descriptionItems: DescriptionsProps["items"] = [
        {
          key: "client_type",
          label: "Client type",
          children: review.client_type,
        },
        {
          key: "country_code",
          label: "Country code",
          children: review.country_code,
        },
        {
          key: "risk_rating",
          label: "Risk rating",
          children: (
            <Tag color={riskColours[review.risk_rating]}>
              {review.risk_rating}
            </Tag>
          ),
        },
        {
          key: "review_status",
          label: "Review status",
          children: (
            <Tag color={statusColours[review.review_status]}>
              {review.review_status}
            </Tag>
          ),
        },
        {
          key: "next_review_date",
          label: "Next review date",
          children: review.next_review_date,
        },
        {
          key: "created_at",
          label: "Created at",
          children: formatCreatedAt(review.created_at),
        },
    ];

    return (
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <Link href="/">← Back to workbench</Link>
          <Card
            title={review.legal_name}
            extra={
              <Tag color={statusColours[review.review_status]}>
                {review.review_status}
              </Tag>
            }
          >
            <Descriptions
              bordered
              column={1}
              items={descriptionItems}
            />
            
            <Divider />
            <ReviewStatusControl reviewId={review.id} currentStatus={review.review_status} />

            <Divider />
            <ReviewStatusHistory events={statusEvents} />
          </Card>
        </Space>
    );
}