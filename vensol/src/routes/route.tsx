import { BrowserRouter, Routes, Route as MyRoute } from "react-router-dom"
import Home from "../pages/Home"
import Header from "../layout/Header"
import { Page } from "../pages/send-tokens/page"

export const Route = () => {
    return(
        <BrowserRouter>
            <Routes>
                <MyRoute 
                    element={<Header />}
                >
                    <MyRoute 
                        path="/"
                        element={<Home />}
                    />
                    <MyRoute 
                        path="/send-token"
                        element={<Page />}
                    />
                </MyRoute>

            </Routes>
        </BrowserRouter>
    )
}