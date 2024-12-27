"use client";

import { useState, useEffect } from "react";
import { RequestPanel } from "../components/request-panel";
import { ResponsePanel } from "../components/response-panel";
import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { useToast } from "../hooks/use-toast";

// Main application component
// Manages the overall state and coordinates between components
export default function Home() {
  // State for response data
  const [responseData, setResponseData] = useState(null); // Response body
  const [responseHeaders, setResponseHeaders] = useState(null); // Response headers
  const [responseStatus, setResponseStatus] = useState(null); // HTTP status code
  const [responseStatusText, setResponseStatusText] = useState(null); // Status text
  const [history, setHistory] = useState([]); // Request history
  const [currentMethod, setCurrentMethod] = useState("GET"); // Track current method
  const [currentUrl, setCurrentUrl] = useState(""); // Track current URL
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("request_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("request_history", JSON.stringify(history));
  }, [history]);

  // Handle successful API responses
  // Updates state and adds the request to history
  const handleResponse = ({ data, headers, status, statusText }) => {
    // Update response state
    setResponseData(data);
    setResponseHeaders(headers);
    setResponseStatus(status);
    setResponseStatusText(statusText);

    // Add request to history with current method and URL
    setHistory((prev) => [
      {
        method: currentMethod,
        url: currentUrl,
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
    localStorage.removeItem("request_history");
    toast({
      title: "History cleared",
      description: "All request history has been cleared.",
    });
  };

  // Save current collection
  const handleSaveCollection = () => {
    const collection = {
      history,
      timestamp: Date.now(),
      name: `Collection ${new Date().toLocaleDateString()}`,
    };

    // Save to file
    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webpost-collection-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Collection saved",
      description: "Your collection has been saved to a file.",
    });
  };

  // Load collection from file
  const handleLoadCollection = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      try {
        const file = e.target.files[0];
        const text = await file.text();
        const collection = JSON.parse(text);

        if (collection.history) {
          setHistory(collection.history);
          toast({
            title: "Collection loaded",
            description: `Loaded ${collection.history.length} requests from collection.`,
          });
        }
      } catch (error) {
        console.error("Failed to load collection:", error);
        toast({
          title: "Error loading collection",
          description: "Failed to load the collection file.",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  // Share collection
  const handleShare = async () => {
    const collection = {
      history,
      timestamp: Date.now(),
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(collection, null, 2));
      toast({
        title: "Collection copied",
        description: "Collection data has been copied to clipboard.",
      });
    } catch (error) {
      console.error("Failed to share collection:", error);
      toast({
        title: "Error sharing collection",
        description: "Failed to copy collection to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onSaveCollection={handleSaveCollection}
        onLoadCollection={handleLoadCollection}
        onShare={handleShare}
      />
      <main className="flex flex-1">
        <Sidebar
          history={history}
          onHistoryItemClick={handleHistoryItemClick}
          onClearHistory={handleClearHistory}
        />
        <div className="flex-1 flex flex-col">
          <RequestPanel
            onResponse={handleResponse}
            onMethodChange={setCurrentMethod}
            onUrlChange={setCurrentUrl}
          />
          <ResponsePanel
            response={responseData}
            headers={responseHeaders}
            status={responseStatus}
            statusText={responseStatusText}
          />
        </div>
      </main>
    </div>
  );
}
