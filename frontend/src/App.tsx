import { useState } from "react"
import { Header } from "./components/Header"
import { Home } from "./components/Home"
import { About } from "./components/About"
import { Projects } from "./components/Projects"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"

function App() {
  const [page, setPage] = useState("home")

  const renderPage = () => {
    switch (page) {
      case "about":
        return <About />
      case "projects":
        return <Projects />
      case "contact":
        return <Contact />
      default:
        return <Home setPage={setPage} />
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header page={page} setPage={setPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  )
}

export default App
