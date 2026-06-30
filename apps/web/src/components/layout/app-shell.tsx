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

import { AuthPromptModal } from "../auth/auth-prompt-modal";

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

<Navbar />

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

<AuthPromptModal />

</div>

);

}