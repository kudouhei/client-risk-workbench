"use client";

import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Select, Space, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ClientRiskReviewCreate } from "@/lib/type";

type FastApiValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

type ApiErrorResponse = {
  detail?: string | FastApiValidationError[];
};

const formFieldNames: Array<
  keyof ClientRiskReviewCreate
> = [
  "legal_name",
  "client_type",
  "country_code",
  "risk_rating",
  "review_status",
  "next_review_date",
];

function isFormFieldName(
  value: unknown,
): value is keyof ClientRiskReviewCreate {
  return (
    typeof value === "string" &&
    formFieldNames.includes(
      value as keyof ClientRiskReviewCreate,
    )
  );
}

async function readResponse(
  response: Response,
): Promise<ApiErrorResponse> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return {};
  }
}

export function CreateClientRiskReviewForm() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm<ClientRiskReviewCreate>();
  const { message } = App.useApp();
  const router = useRouter();

  function handleClose() {
    setOpen(false);
    form.resetFields();
  }

  async function handleFinish(
    values: ClientRiskReviewCreate,
  ) {
    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/client-risk-reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const responseBody = await readResponse(response);

      if (
        response.status === 422 &&
        Array.isArray(responseBody.detail)
      ) {
        const fieldErrors =
          responseBody.detail.flatMap((error) => {
            const fieldName = error.loc.at(-1);

            if (!isFormFieldName(fieldName)) {
              return [];
            }

            return [
              {
                name: fieldName,
                errors: [error.msg],
              },
            ];
          });

        form.setFields(fieldErrors);

        message.error(
          "Please correct the highlighted fields.",
        );

        return;
      }

      if (!response.ok) {
        const errorMessage =
          typeof responseBody.detail === "string"
            ? responseBody.detail
            : "Unable to create the risk review.";

        throw new Error(errorMessage);
      }

      message.success(
        `Risk review created for ${values.legal_name}.`,
      );

      handleClose();
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to create the risk review.";

      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined aria-hidden="true" />}
        onClick={() => setOpen(true)}
      >
        New risk review
      </Button>

      <Modal
        title="Create client risk review"
        open={open}
        onCancel={handleClose}
        footer={null}
        closable={!submitting}
        keyboard={!submitting}
        mask={{ closable: !submitting }}
      >
        <Form<ClientRiskReviewCreate>
          form={form}
          layout="vertical"
          initialValues={{
            risk_rating: "Medium",
            review_status: "In Review",
          }}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Legal name"
            name="legal_name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the client’s legal name.",
              },
              {
                max: 200,
                message:
                  "Legal name cannot exceed 200 characters.",
              },
            ]}
          >
            <Input autoComplete="organization" />
          </Form.Item>

          <Form.Item
            label="Client type"
            name="client_type"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the client type.",
              },
              {
                max: 50,
                message:
                  "Client type cannot exceed 50 characters.",
              },
            ]}
          >
            <Input placeholder="For example: Fund or Bank" />
          </Form.Item>

          <Form.Item
            label="Country code"
            name="country_code"
            normalize={(value) => value.toUpperCase()}
            rules={[
              {
                required: true,
                message: "Enter the country code.",
              },
              {
                pattern: /^[A-Z]{2}$/,
                message:
                  "Use a two-letter uppercase country code.",
              },
            ]}
          >
            <Input
              maxLength={2}
              placeholder="LU"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Risk rating"
            name="risk_rating"
            rules={[
              {
                required: true,
                message: "Select a risk rating.",
              },
            ]}
          >
            <Select
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Review status"
            name="review_status"
            rules={[
              {
                required: true,
                message: "Select a review status.",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "In Review",
                  label: "In Review",
                },
                {
                  value: "Escalated",
                  label: "Escalated",
                },
                {
                  value: "Approved",
                  label: "Approved",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Next review date"
            name="next_review_date"
            rules={[
              {
                required: true,
                message: "Select the next review date.",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              Create risk review
            </Button>

            <Button
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}