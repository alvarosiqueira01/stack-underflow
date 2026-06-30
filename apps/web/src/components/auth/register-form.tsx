"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RegisterForm() {
  return (
    <form className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Name</label>
        <Input placeholder="John Doe" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input placeholder="john@email.com" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <Input type="password" />
      </div>

      <Button type="submit">Create Account</Button>
    </form>
  );
}
