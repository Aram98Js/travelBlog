import { Menu,X } from "lucide-react"
import Button from "../Components/Button"
import "./HamburgerButton.scss"

type HamburgerToggle = {
    toggleFunc: ()=> void,
    hamburgerToggle: boolean
}



const HamburgerButton = ({hamburgerToggle,toggleFunc}: HamburgerToggle) => {
  return (
   <Button onClick={toggleFunc} className="hamburgerBtn">{hamburgerToggle?<X />:<Menu />}</Button>
  )
}

export default HamburgerButton