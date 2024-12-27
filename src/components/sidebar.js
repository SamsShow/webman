"use client";

import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Card } from "./ui/card";

export function Sidebar({ history = [], onHistoryItemClick, onClearHistory }) {
  return (
    <div className="w-64 border-r h-full bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Request History</h2>
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearHistory}
          disabled={history.length === 0}
        >
          Clear History
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="p-4 space-y-2">
          {history.length > 0 ? (
            history.map((item, index) => (
              <Card
                key={index}
                className="p-3 hover:bg-accent cursor-pointer"
                onClick={() => onHistoryItemClick(item)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-1 bg-primary/10 rounded">
                    {item.method}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm truncate">{item.url}</div>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No history yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
