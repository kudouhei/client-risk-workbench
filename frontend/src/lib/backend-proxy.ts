import "server-only";

const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

export async function forwardJsonRequest(
  request: Request,
  backendPath: string,
): Promise<Response> {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json({ detail: "Request body must contain valid JSON." }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(
      `${API_BASE_URL}${backendPath}`,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
      },
    );

    let responseBody: unknown;

    try {
      responseBody = await backendResponse.json();
    } catch {
      console.error(`Backend returned a non-JSON response: ${backendPath}`);

      return Response.json(
        { detail: "The risk service returned an invalid response." }, { status: 502 }
      );
    }

    return Response.json(responseBody, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error(
      "Failed to contact risk service:",
      error,
    );

    return Response.json(
      { detail: "The risk service is temporarily unavailable." }, { status: 503 }
    );
  }
}