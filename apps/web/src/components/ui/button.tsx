type Props=
React.ButtonHTMLAttributes<
HTMLButtonElement
>;

export function Button(
props:Props
){

return(

<button
{...props}

className="
w-full
rounded-xl
bg-[#2F6BFF]
py-4
font-medium
text-white
hover:opacity-90
"

>

{props.children}

</button>

);

}