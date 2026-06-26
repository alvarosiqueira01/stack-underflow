import Link from "next/link";

export function RightPanel(){

return(

<aside
className="
w-[320px]
p-5
space-y-5
"
>

<div
className="
bg-[#FFF8DC]
p-4
rounded
"
>

<h3
className="
font-semibold
mb-3
"
>

The Overflow Blog

</h3>

<Link
href="/questions"
>

Latest Questions →

</Link>

</div>

<div
className="
bg-white
border
p-4
rounded
"
>

<h3
className="
font-semibold
mb-3
"
>

Featured Tags

</h3>

<div
className="
space-y-2
"
>

<Link href="/tags">

typescript

</Link>

<Link href="/tags">

react

</Link>

<Link href="/tags">

nextjs

</Link>

</div>

</div>

</aside>

);

}