"use client";

import { useState } from "react";
import { RequestPanel } from "../components/request-panel";
import { ResponsePanel } from "../components/response-panel";
import { Sidebar } from "../components/sidebar";

// Main application component
// Manages the overall state and coordinates between components
export default function Home() {
  // State for response data
  const [responseData, setResponseData] = useState(null); // Response body
  const [responseHeaders, setResponseHeaders] = useState(null); // Response headers
  const [responseStatus, setResponseStatus] = useState(null); // HTTP status code
  const [responseStatusText, setResponseStatusText] = useState(null); // Status text
  const [history, setHistory] = useState([]); // Request history

  // Handle successful API responses
  // Updates state and adds the request to history
  const handleResponse = ({ data, headers, status, statusText }) => {
    // Update response state
    setResponseData(data);
    setResponseHeaders(headers);
    setResponseStatus(status);
    setResponseStatusText(statusText);

    // Add request to history
    // Gets current method and URL from the DOM since they're not passed directly
    setHistory((prev) => [
      {
        method:
          document.querySelector('button[aria-expanded="true"]')?.textContent ||
          "GET",
        url:
          document.querySelector('input[placeholder="Enter URL"]')?.value || "",
        timestamp: Date.now(),
        data,
        headers,
        status,
        statusText,
      },
      ...prev, // Add new request at the start
    ]);
  };

  // Handle clicking on a history item
  // Restores the previous response state
  const handleHistoryItemClick = (item) => {
    setResponseData(item.data);
    setResponseHeaders(item.headers);
    setResponseStatus(item.status);
    setResponseStatusText(item.statusText);
  };

  // Clear all request history
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <main className="flex h-screen">
      {/* Sidebar with request history */}
      <Sidebar
        history={history}
        onHistoryItemClick={handleHistoryItemClick}
        onClearHistory={handleClearHistory}
      />
      <div className="flex-1 flex flex-col">
        {/* Request configuration panel */}
        <RequestPanel onResponse={handleResponse} />
        {/* Response display panel */}
        <ResponsePanel
          response={responseData}
          headers={responseHeaders}
          status={responseStatus}
          statusText={responseStatusText}
        />
      </div>
    </main>
  );
}
