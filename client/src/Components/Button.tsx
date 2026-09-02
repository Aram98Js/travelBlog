import React from 'react'
import "./Button.scss"
interface PropsButton{
   className: string,
   children: React.ReactNode,
   onClick: ()=>void
   disabled?: boolean
   type?:"submit"|"reset"|"button"
}
const Button = (props:PropsButton) => {
  return (
    <button type={props.type}  disabled={props.disabled} onClick={props.onClick} className={props.className}>{props.children}</button>
  )
}

export default Button