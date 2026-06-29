import {
Navbar
}
from
"@/components/layout/navbar";

import {
Sidebar
}
from
"@/components/layout/sidebar";

import {
RightPanel
}
from
"@/components/layout/right-panel";

export default function Home(){

return(

<div
className="
min-h-screen
bg-white
"
>

<Navbar/>

<div
className="
flex
"
>

<Sidebar/>

<main
className="
flex-1
px-8
py-6
"
>

<div
className="
flex
justify-between
mb-8
"
>

<h1
className="
text-4xl
"
>

All Questions

</h1>

<button
className="
bg-blue-500
text-white
px-4
rounded
"
>

Ask Question

</button>

</div>

<div
className="
bg-white
border
rounded
"
>

{
Array
.from({
length:5
})
.map(
(_,i)=>(

<div

key=
{i}

className="
border-b
border-zinc-200
p-6
"

>

<div
className="
text-blue-600
font-medium
"
>

Why does TypeScript…

</div>

<p
className="
text-sm
text-zinc-500
"
>

Question preview…

</p>

</div>

)
)

}

</div>

</main>

<RightPanel/>

</div>

</div>

);

}