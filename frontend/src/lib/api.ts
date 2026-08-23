import "server-only";

import type { ClientRiskReview } from "./type";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

export async function getClientRiskReviews(): Promise<ClientRiskReview[]> {
    const response = await fetch(`${API_BASE_URL}/api/client-risk-reviews`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch client risk reviews: ${response.statusText}`);
    }

    return (await response.json()) as ClientRiskReview[];
}