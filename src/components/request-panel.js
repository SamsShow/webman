"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useRequest } from "../hooks/useRequest";
import { Card } from "./ui/card";

// List of supported HTTP methods
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

// Main component for making API requests
// Handles request configuration including method, URL, headers, and body
export function RequestPanel({ onResponse, onMethodChange, onUrlChange }) {
  // State for request configuration
  const [url, setUrl] = useState(""); // Store the request URL
  const [method, setMethod] = useState("GET"); // HTTP method (defaults to GET)
  const [requestBody, setRequestBody] = useState(""); // Request body (for POST/PUT)
  const [headers, setHeaders] = useState([{ key: "", value: "" }]); // Request headers
  const [error, setError] = useState(""); // Error messages

  // Get request handling functions from our custom hook
  const { sendRequest, loading } = useRequest();

  // Notify parent component when method or URL changes
  useEffect(() => {
    onMethodChange?.(method);
  }, [method, onMethodChange]);

  useEffect(() => {
    onUrlChange?.(url);
  }, [url, onUrlChange]);

  // Add a new empty header field
  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  // Update a header field (either key or value)
  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  // Remove a header field
  const handleRemoveHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  // Validate the request before sending
  const validateRequest = () => {
    // URL is mandatory
    if (!url.trim()) {
      setError("URL is required");
      return false;
    }

    // For POST/PUT/PATCH, validate JSON if body is provided
    if (method !== "GET" && requestBody) {
      try {
        JSON.parse(requestBody);
      } catch (e) {
        setError("Invalid JSON in request body");
        return false;
      }
    }

    setError("");
    return true;
  };

  // Handle the send request button click
  const handleSendRequest = async () => {
    if (!validateRequest()) return;

    try {
      // Convert our header array to an object format for the request
      const headerObj = headers.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Send the request using our custom hook
      const response = await sendRequest({
        method,
        url,
        headers: headerObj,
        body: requestBody,
      });

      // Pass the response up to the parent component
      onResponse?.(response);
      setError("");
    } catch (error) {
      setError(error.message);
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="p-4 border-b">
      {/* Request configuration bar */}
      <div className="flex gap-2 mb-4">
        {/* HTTP method selector */}
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* URL input field */}
        <Input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />

        {/* Send request button */}
        <Button onClick={handleSendRequest} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Request body and headers tabs */}
      <Tabs defaultValue="body" className="w-full">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        {/* Request body editor */}
        <TabsContent value="body">
          <Textarea
            placeholder="Request body (JSON)"
            className="min-h-[200px] font-mono"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
          />
        </TabsContent>

        {/* Headers editor */}
        <TabsContent value="headers">
          <Card className="p-4">
            {/* Header key-value pair inputs */}
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Header name"
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, "key", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, "value", e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveHeader(index)}
                >
                  ×
                </Button>
              </div>
            ))}

            {/* Add new header button */}
            <Button
              variant="outline"
              onClick={handleAddHeader}
              className="w-full mt-2"
            >
              Add Header
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
