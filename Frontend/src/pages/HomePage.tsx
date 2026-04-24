import Header from "../HomePageComponent/layout/Header"
import Main from "../HomePageComponent/layout/Main"
import Footer from "../HomePageComponent/layout/Footer"


function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* header */}
      <Header />

      {/* main content */}
      <main className="flex-1 px-4 md:px-6 lg:px-10 py-4 md:py-6">
        <Main />
      </main>

      {/* footer */}
      <Footer />

    </div>
  )
}

export default HomePage
