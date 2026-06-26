"use client";

import Link from "next/link";

type Props={
logged?:boolean;
};

export function Navbar({
logged
}:Props){

return(

<header
className="
h-[52px]
bg-white
border-b
flex
items-center
justify-between
px-6
"
>

<div
className="
flex
items-center
gap-8
"
>

<Link
href="/"
>

<div
className="
flex
items-center
gap-2
"
>

<div
className="
w-8
h-8
bg-blue-500
rounded-xl
text-white
text-sm
flex
items-center
justify-center
"
>

S

</div>

StackUnderflow

</div>

</Link>

<nav
className="
flex
gap-5
text-sm
"
>

<Link href="/">

About

</Link>

<Link href="/questions">

Products

</Link>

<Link href="/users">

For Teams

</Link>

</nav>

</div>

<input
placeholder="Search..."
className="
w-[520px]
border
rounded
px-3
"
/>

<div
className="
flex
gap-2
"
>

{
logged

?

<Link href="/profile">

Profile

</Link>

:

<>

<Link href="/login">

Log in

</Link>

<Link
href="/login"
className="
bg-blue-500
text-white
px-4
rounded
"
>

Sign up

</Link>

</>

}

</div>

</header>

);

}