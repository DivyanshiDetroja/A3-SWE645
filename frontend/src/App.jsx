import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StudentSurvey from './components/StudentSurvey'
import ListSurveys from './components/ListSurveys'
import ViewSurvey from './components/ViewSurvey'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StudentSurvey />} />
          <Route path="/surveys" element={<ListSurveys />} />
          <Route path="/surveys/:id" element={<ViewSurvey />} />
          <Route path="/surveys/:id/edit" element={<StudentSurvey />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App
