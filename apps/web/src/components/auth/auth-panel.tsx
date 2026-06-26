"use client";

import {
useState
}
from
"react";

import {
LoginForm
}
from
"./login-form";

import {
RegisterForm
}
from
"./register-form";

export function AuthPanel(){

const[
login,
setLogin
]
=
useState(
true
);

return(

<>

<div
className="
grid
grid-cols-2
rounded-xl
bg-zinc-100
p-1
mb-10
"
>

<button

onClick=
{
()=>
setLogin(
true
)
}

className={

login

?

"rounded-lg bg-white py-3"

:

"py-3"

}

>

Sign In

</button>

<button

onClick=
{
()=>
setLogin(
false
)
}

className={

!login

?

"rounded-lg bg-white py-3"

:

"py-3"

}

>

Create Account

</button>

</div>

<div
className="
transition-all
duration-300
"
>

{
login

?

<LoginForm/>

:

<RegisterForm/>

}

</div>

</>

);

}