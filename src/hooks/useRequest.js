import { useState } from "react";

// Custom hook to handle API requests with built-in state management
// Handles loading states, errors, and response formatting
export function useRequest() {
  // Track various states of the request
  const [response, setResponse] = useState(null); // Stores the response data
  const [responseHeaders, setResponseHeaders] = useState(null); // Stores response headers
  const [error, setError] = useState(null); // Stores any error messages
  const [loading, setLoading] = useState(false); // Tracks loading state

  // Main function to send HTTP requests
  // Accepts method (GET, POST, etc), url, headers and body
  const sendRequest = async ({ method, url, headers = {}, body = null }) => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      // Basic validation - URL is required
      if (!url) {
        throw new Error("URL is required");
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (e) {
        throw new Error("Invalid URL format");
      }

      // Setup request options with default headers and CORS settings
      const options = {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers, // Custom headers should override defaults
        },
        mode: "cors", // Enable CORS
        credentials: "omit", // Don't send credentials by default
      };

      // Handle request body for POST/PUT/PATCH
      if (body && method !== "GET") {
        try {
          // Make sure the body is valid JSON
          if (typeof body === "string") {
            JSON.parse(body); // Will throw if invalid JSON
          }
          options.body = typeof body === "string" ? body : JSON.stringify(body);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }
      }

      // Make the actual API call
      let response;
      try {
        // First try with CORS mode
        response = await fetch(url, options);
      } catch (initialError) {
        // If CORS fails, try without credentials
        try {
          console.warn(
            "Initial request failed, retrying without credentials:",
            initialError.message
          );
          options.credentials = "omit";
          response = await fetch(url, options);
        } catch (networkError) {
          console.error("Network error details:", networkError);
          // Check if it's a CORS error
          if (
            networkError.message.includes("CORS") ||
            networkError.message.includes("cross-origin")
          ) {
            throw new Error(
              "CORS error: The server doesn't allow requests from this origin. Try using a CORS proxy or enable CORS on the server."
            );
          }
          // Otherwise throw a network error
          throw new Error(
            `Network error: ${
              networkError.message || "Failed to connect to server"
            }`
          );
        }
      }

      // Convert headers to a plain object for easier handling
      const headerObj = {};
      response.headers.forEach((value, key) => {
        headerObj[key] = value;
      });

      // Handle different response types (JSON vs Text)
      let responseData;
      const contentType = response.headers.get("content-type");

      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          // Try JSON first even if content-type is not set
          try {
            responseData = await response.json();
          } catch {
            responseData = await response.text(); // Fallback to plain text
          }
        }
      } catch (parseError) {
        console.error("Response parsing error:", parseError);
        throw new Error(`Failed to parse response: ${parseError.message}`);
      }

      // Check if the request was successful (status 200-299)
      if (!response.ok) {
        // Try to extract error message from response
        const errorMessage =
          typeof responseData === "object"
            ? responseData.message ||
              responseData.error ||
              JSON.stringify(responseData)
            : responseData;

        throw new Error(
          `Request failed with status ${response.status}: ${errorMessage}`
        );
      }

      // Update state with successful response
      setResponseHeaders(headerObj);
      setResponse(responseData);

      // Return everything the caller might need
      return {
        data: responseData,
        headers: headerObj,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (err) {
      // Handle any errors that occurred
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Request error:", err);
      setError(errorMessage);

      // Create a more user-friendly error message
      if (errorMessage.includes("Failed to fetch")) {
        throw new Error(
          "Server is unreachable. This might be due to:\n" +
            "1. No internet connection\n" +
            "2. The server is down\n" +
            "3. CORS is not enabled on the server\n" +
            "Try checking your connection or using a different API endpoint."
        );
      } else if (errorMessage.includes("NetworkError")) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      } else if (errorMessage.includes("CORS")) {
        throw new Error(
          "CORS error: The API doesn't allow requests from this application.\n" +
            "Possible solutions:\n" +
            "1. Use a CORS proxy\n" +
            "2. Enable CORS on the server\n" +
            "3. Try a different API endpoint"
        );
      } else {
        throw err;
      }
    } finally {
      // Always stop loading, whether successful or not
      setLoading(false);
    }
  };

  // Return everything needed by components using this hook
  return {
    sendRequest,
    response,
    responseHeaders,
    error,
    loading,
  };
}
