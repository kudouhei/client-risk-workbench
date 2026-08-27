"use client";

import { Empty, Timeline, Typography } from "antd";
import type { ClientRiskReviewStatusEvent, ReviewStatus } from "@/lib/type";

const statusColours: Record<ReviewStatus, string> = {
  Approved: "green",
  "In Review": "blue",
  Escalated: "red",
};

function formatChangedAt(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ReviewStatusHistory({
    events,
  }: {
    events: ClientRiskReviewStatusEvent[];
  }) {
    const timelineItems = events.map((event) => ({
      key: event.id,
      color: statusColours[event.new_status],
      children: (
        <div>
          <Typography.Text strong>
            {event.previous_status}
            {" → "}
            {event.new_status}
          </Typography.Text>
  
          <br />
  
          <Typography.Text type="secondary">
            <time dateTime={event.changed_at}>
              {formatChangedAt(event.changed_at)}
            </time>
            {" · "}
            Changed by {event.changed_by}
          </Typography.Text>
  
          {event.change_reason && (
            <>
              <br />
  
              <Typography.Text>
                Reason: {event.change_reason}
              </Typography.Text>
            </>
          )}
        </div>
      ),
    }));
  
    return (
      <section aria-labelledby="status-history-heading">
        <Typography.Title
          id="status-history-heading"
          level={4}
        >
          Status history
        </Typography.Title>
  
        {timelineItems.length > 0 ? (
          <Timeline items={timelineItems} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No status changes recorded yet."
          />
        )}
      </section>
    );
}