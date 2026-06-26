type Props =
React.InputHTMLAttributes<
HTMLInputElement
>;

export function Input(
props:Props
){

return(

<input
{...props}

className="
w-full
rounded-xl
border
border-zinc-200
bg-white
px-5
py-4
text-zinc-700
outline-none
focus:border-[#2F6BFF]
"
/>

);

}