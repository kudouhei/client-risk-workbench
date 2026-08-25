"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import Link from "next/link";

import type { ClientRiskReview, ReviewStatus, RiskRating } from "@/lib/type";

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

const columns: TableColumnsType<ClientRiskReview> = [
    {
      title: "Client",
      dataIndex: "legal_name",
      key: "legal_name",
      render: (
        legalName: string,
        review: ClientRiskReview,
      ) => (
        <Link href={`/reviews/${review.id}`}>{legalName}</Link>
      ),
      sorter: (first, second) =>
        first.legal_name.localeCompare(second.legal_name),
    },
    {
      title: "Type",
      dataIndex: "client_type",
      key: "client_type",
    },
    {
      title: "Country",
      dataIndex: "country_code",
      key: "country_code",
      width: 100,
    },
    {
      title: "Risk",
      dataIndex: "risk_rating",
      key: "risk_rating",
      render: (risk: RiskRating) => (
        <Tag color={riskColours[risk]}>{risk}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "review_status",
      key: "review_status",
      render: (status: ReviewStatus) => (
        <Tag color={statusColours[status]}>{status}</Tag>
      ),
    },
    {
      title: "Next review",
      dataIndex: "next_review_date",
      key: "next_review_date",
    },
  ];

export function ClientRiskTable({ reviews}: { reviews: ClientRiskReview[] }) {

    const [ searchQuery, setSearchQuery ] = useState("");

    const filteredReviews = useMemo(() => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        if (!normalizedQuery) return reviews;

        return reviews.filter((review) => {
            const searchableText = [
                review.legal_name,
                review.client_type,
                review.country_code,
                review.risk_rating,
                review.review_status,
            ].join(" ").toLowerCase();

            return searchableText.includes(normalizedQuery);
        })

    }, [reviews, searchQuery]);

    return (
        <Card>
            <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
                <label htmlFor="client-search" style={{ fontWeight: 600 }}> Search clients: </label>
                <Input 
                    id="client-search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    prefix={<SearchOutlined aria-hidden="true"/>}
                    placeholder="Search clients, type, country, risk, or status"
                    allowClear
                    style={{ maxWidth: 420 }}
                />

                <section aria-labelledby="client-risk-reviews-heading">
                    <h2 id="client-risk-reviews-heading">
                        Client Risk Reviews ({filteredReviews.length})
                    </h2>

                    <Table<ClientRiskReview>
                        columns={columns}
                        dataSource={filteredReviews}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: 760 }}
                        locale={{
                        emptyText: "No clients match your search.",
                        }}
                    />
                </section>

            </Space>
        </Card>
    )
}