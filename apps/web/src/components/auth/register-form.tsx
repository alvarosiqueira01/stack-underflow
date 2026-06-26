"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RegisterForm(){

return(

<form
className="
space-y-5
"
>

<div>

<label>
Name
</label>

<Input
placeholder=
"John Doe"
/>

</div>

<div>

<label>
Email
</label>

<Input
placeholder=
"john@email.com"
/>

</div>

<div>

<label>
Password
</label>

<Input
type=
"password"
/>

</div>

<Button>

Create Account

</Button>

</form>

);

}