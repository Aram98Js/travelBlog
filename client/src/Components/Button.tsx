import React from 'react'
import "./Button.scss"
interface PropsButton{
   className: string,
   children: React.ReactNode,
   onClick: ()=>void

}
const Button = (props:PropsButton) => {
  return (
    <button onClick={props.onClick} className={props.className}>{props.children}</button>
  )
}

export default Button