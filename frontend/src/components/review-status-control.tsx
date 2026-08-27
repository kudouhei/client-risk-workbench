"use client";

import { App, Button, Popconfirm, Select, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import type { ReviewStatus} from "@/lib/type";

type ApiErrorResponse = {
    detail?: string | unknown[];
}

const statusOptions: Array<{value: ReviewStatus; label: string}> = [
    { value: "In Review", label: "In Review",},
    { value: "Escalated", label: "Escalated",},
    { value: "Approved", label: "Approved",},
];

export function ReviewStatusControl({ reviewId, currentStatus}: { reviewId: number; currentStatus: ReviewStatus }) {
    const [selectedStatus, setSelectedStatus] = useState<ReviewStatus>(currentStatus);
    const [updating, setUpdating] = useState(false);

    const selectId = useId();
    const router = useRouter();
    const { message } = App.useApp();

    const statusIsUnchanged = selectedStatus === currentStatus;

    async function handleUpdateStatus() {
        setUpdating(true);

        try {
            const response = await fetch(
                `/api/client-risk-reviews/${reviewId}/status`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    review_status: selectedStatus,
                  }),
                },
              );
              let responseBody: ApiErrorResponse = {};
              try {
                responseBody = (await response.json()) as ApiErrorResponse;
              } catch {
                // A malformed response is handled below.
              }

              if (!response.ok) {
                const errorMessage = typeof responseBody.detail === "string" ? responseBody.detail : "Unable to update the review status.";
                throw new Error(errorMessage);
              }

              message.success(`Review status updated to ${selectedStatus}.`);

              router.refresh();

        } catch (error) {
            message.error(error instanceof Error ? error.message : "Unable to update the review status.");
        } finally {
            setUpdating(false);
        }
    }

    return (
        <section aria-labelledby="update-review-status-heading">
          <Space
            orientation="vertical"
            size="middle"
            style={{ width: "100%" }}
          >
            <div>
              <Typography.Title
                id="update-review-status-heading"
                level={4}
                style={{ marginBottom: 4 }}
              >
                Update review status
              </Typography.Title>
    
              <Typography.Text type="secondary"> Select the new workflow status and confirm the change.</Typography.Text>
            </div>
    
            <Space wrap>
              <label htmlFor={selectId} style={{ fontWeight: 600 }}>New status</label>
              <Select<ReviewStatus>
                id={selectId}
                value={selectedStatus}
                options={statusOptions}
                onChange={setSelectedStatus}
                style={{ minWidth: 180 }}
              />
    
              <Popconfirm
                title="Confirm status update"
                description={
                  `Change status from ${currentStatus} to ${selectedStatus}?`
                }
                okText="Confirm"
                cancelText="Cancel"
                disabled={statusIsUnchanged}
                onConfirm={handleUpdateStatus}
              >
                <Button
                  type="primary"
                  disabled={statusIsUnchanged}
                  loading={updating}
                >
                  Update status
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        </section>
      );
}