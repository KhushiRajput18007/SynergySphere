export async function apiRequest<T>(
    method: string,
    url: string,
    data?: unknown
): Promise<T> {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Something went wrong");
    }

    return response.json();
}
