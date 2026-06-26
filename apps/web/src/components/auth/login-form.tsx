"use client";

import {
useForm
} from "react-hook-form";

import {
Input
} from "../ui/input";

import {
Button
} from "../ui/button";

export function LoginForm(){

const{
register,
handleSubmit
}=useForm();

function submit(
data:any
){

console.log(data);

}

return(

<form
onSubmit={
handleSubmit(
submit
)
}

className="
space-y-6
"
>

<div>

<label
className="
mb-2
block
text-sm
font-medium
"
>

Email or Username

</label>

<Input
placeholder=
"amelie@untitled.com"

{
...register(
"email"
)
}
/>

</div>

<div>

<label
className="
mb-2
block
text-sm
font-medium
"
>

Password

</label>

<Input

type=
"password"

{
...register(
"password"
)
}
/>

<p
className="
mt-2
text-sm
text-red-500
"
>

Incorrect password.

</p>

</div>

<div
className="
flex
justify-between
text-sm
"
>

<label>

<input
type="checkbox"
/>

 Remember me

</label>

<a
className="
text-[#2F6BFF]
"
>

Forgot password?

</a>

</div>

<Button>

Sign In

</Button>

<div
className="
py-5
text-center
text-zinc-400
"
>

Or continue with

</div>

<div
className="
grid
grid-cols-2
gap-4
"
>

<button
className="
rounded-xl
border
py-3
"
>

GitHub

</button>

<button
className="
rounded-xl
border
py-3
"
>

Google

</button>

</div>

<p
className="
mt-8
text-center
text-sm
text-zinc-400
"
>

By joining, you agree to our Terms and Privacy Policy.

</p>

</form>

);

}