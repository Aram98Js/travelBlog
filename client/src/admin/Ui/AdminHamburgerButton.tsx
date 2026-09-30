import { Menu,X } from "lucide-react"
import Button from "../../Components/Button"
import './adminHamburgerButton.scss'
type HandleToggleWorker = {
    handleToggle: ()=>void,
openSideBar: boolean
}

const AdminHamburgerButton = ({handleToggle,openSideBar}:HandleToggleWorker) => {
  return (
       <Button onClick={handleToggle} className="AdminHamburgerBtn">{openSideBar?<X />:<Menu />}</Button>
  )
}

export default AdminHamburgerButton