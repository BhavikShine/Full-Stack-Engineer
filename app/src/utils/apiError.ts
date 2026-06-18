export function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message && error.message !== "Request failed with status code 401") {
    return error.message;
  }

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    if (typeof record.error === "string") {
      return record.error;
    }

    if (typeof record.message === "string") {
      return record.message;
    }

    if (record.data && typeof record.data === "object") {
      const data = record.data as Record<string, unknown>;

      if (typeof data.error === "string") {
        return data.error;
      }

      if (typeof data.message === "string") {
        return data.message;
      }
    }
  }

  return fallback;
}

function isAuthRoute(url?: string) {
  if (!url) {
    return false;
  }

  return url.includes("auth/login") || url.includes("auth/register");
}

export function shouldHandleSessionExpiry(status?: number, url?: string) {
  return status === 401 && !isAuthRoute(url);
}
