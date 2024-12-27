"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card } from "./ui/card";

// Component to display API response data
// Shows response status, body, and headers in a tabbed interface
export function ResponsePanel({ response, headers, status, statusText }) {
  // Helper function to format JSON data for display
  // Falls back to string representation if JSON parsing fails
  const formatJSON = (data) => {
    try {
      return JSON.stringify(data, null, 2); // Pretty print JSON
    } catch (error) {
      return String(data); // Fallback to string if not valid JSON
    }
  };

  // Helper to determine status color based on HTTP status code
  // Green for success (2xx)
  // Yellow for redirects (3xx)
  // Red for client/server errors (4xx/5xx)
  const getStatusColor = (status) => {
    if (!status) return "text-muted-foreground";
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 400) return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="flex-1 p-4 bg-background">
      {/* Status bar showing response code and text */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold">Status:</span>
        <span className={getStatusColor(status)}>
          {status ? `${status} ${statusText}` : "No response yet"}
        </span>
      </div>

      {/* Tabs for response body and headers */}
      <Tabs defaultValue="response" className="w-full h-[calc(100%-40px)]">
        <TabsList>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        {/* Response body tab - shows formatted JSON/text */}
        <TabsContent value="response" className="h-[calc(100%-40px)]">
          <pre className="bg-secondary p-4 rounded-lg h-full overflow-auto font-mono text-sm">
            {response ? formatJSON(response) : "No response yet"}
          </pre>
        </TabsContent>

        {/* Headers tab - shows response headers in key-value format */}
        <TabsContent value="headers" className="h-[calc(100%-40px)]">
          <Card className="bg-secondary p-4 rounded-lg h-full overflow-auto">
            {headers ? (
              <div className="space-y-2">
                {Object.entries(headers).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-semibold min-w-[200px]">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No headers available</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
