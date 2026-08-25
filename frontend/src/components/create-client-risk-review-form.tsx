"use client";

import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Select, Space } from "antd";
import { useState } from "react";

import type { ClientRiskReviewCreate } from "@/lib/type";

export function CreateClientRiskReviewForm() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<ClientRiskReviewCreate>();
  const { message } = App.useApp();

  function handleClose() {
    setOpen(false);
    form.resetFields();
  }

  function handleFinish(values: ClientRiskReviewCreate) {
    message.success(
      `Draft for ${values.legal_name} passed local validation.`,
    );
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
                message: "Legal name cannot exceed 200 characters.",
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
                message: "Client type cannot exceed 50 characters.",
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
                message: "Use a two-letter uppercase country code.",
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
                { value: "In Review", label: "In Review" },
                { value: "Escalated", label: "Escalated" },
                { value: "Approved", label: "Approved" },
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
            <Button type="primary" htmlType="submit"> Validate draft</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Space>

        </Form>
      </Modal>
    </>
  );
}