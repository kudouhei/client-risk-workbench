import { forwardJsonRequest } from "@/lib/backend-proxy";

type StatusRouteContext = {
    params: Promise<{ reviewId: string }>;
}

export async function PATCH(request: Request, context: StatusRouteContext): Promise<Response> {
    const { reviewId } = await context.params;

    return forwardJsonRequest(
        request,
        `/api/client-risk-reviews/${encodeURIComponent(reviewId)}/status`
    );
}