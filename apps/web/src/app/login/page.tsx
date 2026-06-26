import Image from "next/image";

import {
AuthPanel
}
from
"@/components/auth/auth-panel";

export default function Login(){

return(

<main
className="
min-h-screen
bg-white
"
>

<div
className="
grid
grid-cols-2
min-h-screen
"
>

<section
className="
flex
justify-center
pt-10
"
>

<div
className="
w-[420px]
"
>

<div
className="
flex
gap-4
mb-10
"
>

<div
className="
h-12
w-12
rounded-xl
bg-blue-500
text-white
flex
items-center
justify-center
"
>

S

</div>

<h1
className="
text-3xl
font-bold
"
>

stackdev

</h1>

</div>

<h2
className="
text-4xl
font-bold
mb-2
"
>

Welcome back

</h2>

<p
className="
text-zinc-500
mb-10
"
>

Please enter your details.

</p>

<AuthPanel/>

</div>

</section>

<section
className="
relative
m-5
rounded-3xl
overflow-hidden
"
>

<Image

src=
"/images/login-bg.jpg"

alt=
"bg"

fill

className="
object-cover
"

/>

</section>

</div>

</main>

);

}