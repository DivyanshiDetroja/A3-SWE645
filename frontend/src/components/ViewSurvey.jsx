import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from './Header'

function ViewSurvey() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [survey, setSurvey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSurvey()
  }, [id])

  const fetchSurvey = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/surveys/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Survey not found')
          navigate('/surveys')
          return
        }
        throw new Error('Failed to fetch survey')
      }
      const data = await response.json()
      setSurvey(data)
    } catch (error) {
      console.error('Error fetching survey:', error)
      toast.error('Failed to load survey')
      navigate('/surveys')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    navigate(`/surveys/${id}/edit`)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/surveys/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete survey')
      }

      toast.success('Survey deleted successfully!')
      navigate('/surveys')
    } catch (error) {
      console.error('Error deleting survey:', error)
      toast.error('Failed to delete survey')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <main>
        <Header />
        <div className="container text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    )
  }

  if (!survey) {
    return (
      <main>
        <Header />
        <div className="container">
          <div className="alert alert-danger">Survey not found</div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Header />
      <div className="divider"></div>
      <div className="divider"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-success">Survey Details</h2>
                <p className="text-muted">Survey ID: {survey.id}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-warning btn-lg" onClick={handleUpdate}>
                  Update Survey
                </button>
                <button 
                  className="btn btn-danger btn-lg" 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Survey'}
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Delete</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowDeleteConfirm(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to delete this survey?</p>
                      <p className="text-muted">
                        <strong>{survey.first_name} {survey.last_name}</strong> - {survey.email}
                      </p>
                      <p className="text-danger">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">Personal Information</h4>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>First Name:</strong> {survey.first_name}
                  </div>
                  <div className="col-md-6">
                    <strong>Last Name:</strong> {survey.last_name}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <strong>Street Address:</strong> {survey.street_address}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>City:</strong> {survey.city}
                  </div>
                  <div className="col-md-4">
                    <strong>State:</strong> {survey.state}
                  </div>
                  <div className="col-md-4">
                    <strong>ZIP Code:</strong> {survey.zip}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Telephone:</strong> {survey.telephone}
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong> {survey.email}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Survey Date:</strong> {formatDate(survey.survey_date)}
                  </div>
                </div>
              </div>
            </div>

            {/* What Liked Most */}
            {survey.liked_most && survey.liked_most.length > 0 && (
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">What You Liked Most About Campus</h4>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {survey.liked_most.map((item, index) => (
                      <li key={index} className="mb-2">
                        <span className="badge bg-success me-2">✓</span>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Interest Source */}
            {survey.interest_source && (
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">How You Became Interested</h4>
                </div>
                <div className="card-body">
                  <p className="mb-0">{survey.interest_source.charAt(0).toUpperCase() + survey.interest_source.slice(1)}</p>
                </div>
              </div>
            )}

            {/* Recommendation */}
            {survey.recommendation && (
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">Recommendation</h4>
                </div>
                <div className="card-body">
                  <p className="mb-0">{survey.recommendation.charAt(0).toUpperCase() + survey.recommendation.slice(1).replace(/([A-Z])/g, ' $1')}</p>
                </div>
              </div>
            )}

            {/* Raffle Numbers */}
            {survey.raffle && survey.raffle.length > 0 && (
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">Raffle Numbers</h4>
                </div>
                <div className="card-body">
                  <p className="mb-0">
                    {survey.raffle.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Comments */}
            {survey.comments && (
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">Additional Comments</h4>
                </div>
                <div className="card-body">
                  <p className="mb-0">{survey.comments}</p>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/surveys')}>
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="container">
        <footer className="py-3 my-4">
          <p className="text-center text-body-secondary">Made with ❤️ by Divyanshi, Yashwanth, and Aditi - SWE645 Assignment 3</p>
        </footer>
      </div>
    </main>
  )
}

export default ViewSurvey

