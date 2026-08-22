import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { Home } from "./components/Home"
import { About } from "./components/About"
import { Projects } from "./components/Projects"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"
import { RequireOwner } from "./components/RequireOwner"
import { Login } from "./pages/Login"
import { ContactsTable } from "./pages/admin/ContactsTable"
import { ContactDetail } from "./pages/admin/ContactDetail"

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireOwner>
                  <ContactsTable />
                </RequireOwner>
              }
            />
            <Route
              path="/admin/contacts/:id"
              element={
                <RequireOwner>
                  <ContactDetail />
                </RequireOwner>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
