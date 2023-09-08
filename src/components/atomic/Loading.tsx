// a simple loading component, 3 dots in a line that sequentially appear and disappear
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-2 h-2 bg-theme-200 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-theme-200 rounded-full animate-bounce200"></div>
      <div className="w-2 h-2 bg-theme-200 rounded-full animate-bounce400"></div>
    </div>
  );
}
