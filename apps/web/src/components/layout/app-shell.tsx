type Props={
authenticated?:boolean;

children:
React.ReactNode;
};

import {
Navbar
}
from
"./navbar";

import {
Sidebar
}
from
"./sidebar";

export function AppShell({
children,
authenticated
}:Props){

return(

<div
className="
min-h-screen
bg-[#F8F9FA]
"
>

<Navbar
authenticated=
{authenticated}
/>

<div
className="
flex
"
>

<Sidebar
authenticated=
{authenticated}
/>

<main
className="
flex-1
p-8
"
>

{children}

</main>

</div>

</div>

);

}