import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from './Header'

function ListSurveys() {
  const [surveys, setSurveys] = useState([])
  const [filteredSurveys, setFilteredSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [nameFilter, setNameFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchSurveys()
  }, [])

  useEffect(() => {
    filterSurveys()
  }, [nameFilter, dateFilter, surveys])

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      // Add timeout to prevent long waits
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch('/api/surveys/', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        // For 500 errors, show a more helpful message
        if (response.status === 500) {
          console.error('Server error:', response.status)
          toast.error('Server error. Please try again later.')
          setSurveys([])
          setFilteredSurveys([])
          return
        }
        // For other errors, throw to be caught below
        if (response.status >= 400) {
          throw new Error(`Failed to fetch surveys: ${response.status}`)
        }
      }
      
      const data = await response.json()
      // Handle empty array as success, not error
      setSurveys(Array.isArray(data) ? data : [])
      setFilteredSurveys(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching surveys:', error)
      
      // Don't show error for aborted requests (timeout) or network errors
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.')
      } else if (error.message && error.message.includes('Failed to fetch')) {
        toast.error('Unable to connect to server. Please check your connection.')
      } else if (error.message && !error.message.includes('404')) {
        // Only show toast for actual errors, not empty results
        toast.error('Failed to load surveys')
      }
      // Set empty array on error to show empty state
      setSurveys([])
      setFilteredSurveys([])
    } finally {
      setLoading(false)
    }
  }

  const filterSurveys = () => {
    let filtered = [...surveys]

    if (nameFilter) {
      const nameLower = nameFilter.toLowerCase()
      filtered = filtered.filter(survey => 
        survey.first_name.toLowerCase().includes(nameLower) ||
        survey.last_name.toLowerCase().includes(nameLower) ||
        `${survey.first_name} ${survey.last_name}`.toLowerCase().includes(nameLower)
      )
    }

    if (dateFilter) {
      filtered = filtered.filter(survey => survey.survey_date === dateFilter)
    }

    setFilteredSurveys(filtered)
  }

  const handleView = (surveyId) => {
    navigate(`/surveys/${surveyId}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <main>
      <Header />
      <div className="divider"></div>
      <div className="divider"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="text-center mb-4">
              <h2 className="text-success">Survey List</h2>
              <p className="lead">View and manage all submitted surveys</p>
            </div>

            {/* Filters */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title text-success mb-3">Filter Surveys</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nameFilter" className="form-label">Filter by Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nameFilter"
                      placeholder="Enter first or last name..."
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="dateFilter" className="form-label">Filter by Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateFilter"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>
                {(nameFilter || dateFilter) && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setNameFilter('')
                      setDateFilter('')
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Survey List */}
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredSurveys.length === 0 ? (
              <div className="alert alert-info text-center">
                {surveys.length === 0 
                  ? 'No surveys found. Create your first survey!' 
                  : 'No surveys match your filters.'}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-success">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>City, State</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSurveys.map((survey) => (
                      <tr key={survey.id}>
                        <td>{survey.id}</td>
                        <td>{survey.first_name} {survey.last_name}</td>
                        <td>{survey.email}</td>
                        <td>{formatDate(survey.survey_date)}</td>
                        <td>{survey.city}, {survey.state}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleView(survey.id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-muted">Showing {filteredSurveys.length} of {surveys.length} surveys</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="container">
        <footer className="py-3 my-4">
          <p className="text-center text-body-secondary">Made with ❤️ by Divyanshi, Yashwanth, and Aditi - SWE645 Assignment 2</p>
        </footer>
      </div>
    </main>
  )
}

export default ListSurveys

