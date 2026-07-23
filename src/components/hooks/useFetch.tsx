import { useEffect } from "react";
import { API_CONFIG } from "@/lib/api-config";
import { getAuthToken } from "@/lib/auth-utils";

export async function excuteFetch(url: string, method: string, data: any = null) {
  const token = getAuthToken();
  
  const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${url}`, {
    credentials: 'include',
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: method !== "GET" && data ? JSON.stringify(data) : undefined,
  });
  
  const result = await res.json();
  
  if (!res.ok) {
    throw new Error(result.error?.message || "Something went wrong");
  }
  
  return result;
}


export function useLiveRefresh(onRefresh: () => void) {
  useEffect(() => {
    const eventSource = new EventSource("/api/live");

    eventSource.onmessage = (event) => {
      if (event.data === "refresh") {
        onRefresh(); 
      }
    };

    return () => {
      eventSource.close();
    };
  }, [onRefresh]);
}
