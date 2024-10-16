import Header from "@/components/shared/Header"
import MobileNav from "@/components/shared/MobileNav"


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <div>
      <div className="hidden sm:block">
        <Header/>
        </div>
        {/* Mobile navigation for smaller screens */}
        <div className='lg:hidden'>
          <MobileNav />
        </div>

        <div>
          {children}
        </div>
      </div>
    </main>
  )
}

export default Layout