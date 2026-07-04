import { createRoot } from "react-dom/client";

function App() {
    return (
        <h1>
            Hello, World!
        </h1>
    )
}

const rootElement = document.getElementById("root")

if (rootElement) {
    createRoot(rootElement).render(<App />)
} else {
    throw new Error("The Root Element Does Not Exist.")
}