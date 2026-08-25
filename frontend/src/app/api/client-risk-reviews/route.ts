const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

async function readResponseBody(response: Response): Promise<unknown> {
    try {
        return await response.json();
      } catch {
        return {
          detail: "The backend returned a non-JSON response.",
        };
      }
}

export async function POST(request: Request) {
    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return Response.json({
            detail: "The request body is not valid JSON.",
        }, { status: 400 });
    }

    try {
        const backendResponse = await fetch(`${API_BASE_URL}/api/client-risk-reviews`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
              cache: "no-store",
              signal: AbortSignal.timeout(5_000),
            },
          );

          const responseBody = await readResponseBody(backendResponse);
          return Response.json(responseBody, {
            status: backendResponse.status,
          });
      } catch (error) {
        console.error("Failed to create client risk review:", error);
    
        return Response.json({
            detail: "The risk service is temporarily unavailable.",
        }, { status: 503 });
      }
}