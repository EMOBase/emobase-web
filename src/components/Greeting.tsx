import { useState } from "react";

export default function Greeting({ messages }: { messages: string[] }) {
  const randomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div>
      <h3 className="text-indigo-500">{greeting}! Thank you for visiting!</h3>
      <button
        onClick={() => setGreeting(randomMessage())}
        className="cursor-pointer"
      >
        New Greeting
      </button>
    </div>
  );
}
