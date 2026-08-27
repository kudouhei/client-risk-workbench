import { forwardJsonRequest,} from "@/lib/backend-proxy";

export async function POST(
  request: Request,
): Promise<Response> {
  return forwardJsonRequest(request, "/api/client-risk-reviews");
}