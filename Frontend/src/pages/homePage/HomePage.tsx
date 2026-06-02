import Header from "./sections/Header"
import Main from "./sections/Main"
import Footer from "./sections/Footer"


function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* header */}
      <Header />

      {/* main content */}
      <main className="flex-1 mt-3">
        <Main />
      </main>

      {/* footer */}
      <Footer />

    </div>
  )
}

export default HomePage
