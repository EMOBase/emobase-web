import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function Greeting({ messages }: { messages: string[] }) {
  const randomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div className="p-8">
      <h3 className="text-indigo-500 mb-4">
        {greeting}! Thank you for visiting!
      </h3>
      <Button onClick={() => setGreeting(randomMessage())}>New Greeting</Button>
    </div>
  );
}
