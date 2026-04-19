import Header from "../HomePageComponent/layout/Header"
import Main from "../HomePageComponent/layout/Main"
import Footer from "../HomePageComponent/layout/Footer"


function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      {/* header part */}
      <Header/>
      {/* main */}
      <Main />
      {/* footer */}
      <Footer />
    </div>
  )
}

export default HomePage
