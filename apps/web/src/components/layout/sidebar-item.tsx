type Props = {

label:string;

active?:boolean;

icon?:React.ReactNode;

};

export function SidebarItem({

label,

active,

icon

}:Props){

return(

<button
className={`
w-full
flex
items-center
gap-3

px-5
py-3

text-sm

transition

${
active

?

"bg-[#E6F0FF] text-blue-600 border-r-4 border-blue-500"

:

"hover:bg-white text-zinc-700"
}
`}
>

<div>

{icon}

</div>

<span>

{label}

</span>

</button>

);

}