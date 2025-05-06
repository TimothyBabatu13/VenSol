import { BrowserRouter, Routes, Route as MyRoute } from "react-router-dom"
import Home from "../pages/Home"

export const Route = () => {
    return(
        <BrowserRouter>
            <Routes>
                <MyRoute 
                    index
                    Component={Home}
                />
            </Routes>
        </BrowserRouter>
    )
}