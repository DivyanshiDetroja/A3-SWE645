import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const isSurveyFormPage = location.pathname === '/' || location.pathname.startsWith('/surveys/') && location.pathname.includes('/edit')

  return (
    <header className="p-3 text-bg-white sticky-top bg-white">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <img src="/gmu_cec_logo.png" alt="GMU CEC Logo" width="120" height="auto" />
          </Link>
          <nav className="d-flex gap-3">
            {!isSurveyFormPage && (
              <Link to="/" className="btn btn-outline-success">Create Survey</Link>
            )}
            <Link to="/surveys" className="btn btn-outline-success">View Surveys</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

