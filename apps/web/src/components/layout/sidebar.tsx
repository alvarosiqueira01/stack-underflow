"use client";

import Link from "next/link";

const menu=[

["Home","/"],
["Questions","/questions"],
["Tags","/tags"],
["Users","/users"],
["Companies","/companies"]

];

export function Sidebar(){

return(

<aside
className="
w-[180px]
border-r
bg-[#F8F9F9]
min-h-screen
"
>

<div
className="
pt-3
"
>

{
menu.map(
([label,href])=>(

<Link

key=
{label}

href=
{href}

className="
block
px-5
py-3
hover:bg-white
"

>

{label}

</Link>

)
)

}

</div>

<div
className="
absolute
bottom-6
left-5
space-y-2
text-sm
"
>

<div>

Help

</div>

<div>

Documentation

</div>

<div>

Leaderboard

</div>

</div>

</aside>

);

}