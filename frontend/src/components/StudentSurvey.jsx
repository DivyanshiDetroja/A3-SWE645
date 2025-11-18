import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from './Header'

function StudentSurvey() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  const firstNameRef = useRef(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    telephone: '',
    email: '',
    survey_date: '',
    liked_most: [],
    interest_source: '',
    recommendation: '',
    raffle: '',
    comments: ''
  })
  const [raffleError, setRaffleError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load survey data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchSurvey()
    } else {
      // Set today's date as default for new survey
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, survey_date: today }))
      if (firstNameRef.current) {
        firstNameRef.current.focus()
      }
    }
  }, [id])

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch survey')
      }
      const data = await response.json()
      
      // Convert survey data to form format
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        street_address: data.street_address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        telephone: data.telephone || '',
        email: data.email || '',
        survey_date: data.survey_date || '',
        liked_most: data.liked_most || [],
        interest_source: data.interest_source || '',
        recommendation: data.recommendation || '',
        raffle: data.raffle ? data.raffle.join(', ') : '',
        comments: data.comments || ''
      })
      
      if (firstNameRef.current) {
        firstNameRef.current.focus()
      }
    } catch (error) {
      console.error('Error fetching survey:', error)
      toast.error('Failed to load survey')
      navigate('/surveys')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'likedMost') {
      const likedMost = formData.liked_most
      if (checked) {
        setFormData({ ...formData, liked_most: [...likedMost, value] })
      } else {
        setFormData({ ...formData, liked_most: likedMost.filter(item => item !== value) })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const validateRaffleNumbers = (raffleInput) => {
    if (!raffleInput || raffleInput.trim() === '') {
      setRaffleError('Please enter at least 10 numbers.')
      return false
    }
    
    const numbers = raffleInput.split(',').map(num => num.trim()).filter(num => num !== '')
    
    // Check if at least 10 numbers
    if (numbers.length < 10) {
      setRaffleError('Please enter at least 10 numbers.')
      return false
    }
    
    // Check if all numbers are valid (1-100)
    for (let num of numbers) {
      const number = parseInt(num)
      if (isNaN(number) || number < 1 || number > 100) {
        setRaffleError('All numbers must be between 1 and 100.')
        return false
      }
    }
    
    setRaffleError('')
    return true
  }

  const handleRaffleChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, raffle: value })
    validateRaffleNumbers(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate raffle numbers
    if (!validateRaffleNumbers(formData.raffle)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Parse raffle numbers from comma-separated string to array
      const raffleNumbers = formData.raffle
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num) && num >= 1 && num <= 100)

      // Prepare data for API
      const surveyData = {
        ...formData,
        raffle: raffleNumbers,
        survey_date: formData.survey_date
      }

      // Submit to backend API
      const url = isEditMode ? `/api/surveys/${id}` : '/api/surveys/'
      const method = isEditMode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Failed to ${isEditMode ? 'update' : 'submit'} survey`)
      }

      const result = await response.json()
      toast.success(isEditMode ? 'Survey updated successfully!' : 'Survey submitted successfully! Thank you for your feedback.')
      
      if (isEditMode) {
        // Redirect to view page after update
        navigate(`/surveys/${id}`)
      } else {
        // Reset form for new survey
        const today = new Date().toISOString().split('T')[0]
        setFormData({
          first_name: '',
          last_name: '',
          street_address: '',
          city: '',
          state: '',
          zip: '',
          telephone: '',
          email: '',
          survey_date: today,
          liked_most: [],
          interest_source: '',
          recommendation: '',
          raffle: '',
          comments: ''
        })
        setRaffleError('')
        if (firstNameRef.current) {
          firstNameRef.current.focus()
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'submitting'} survey:`, error)
      toast.error(`Error ${isEditMode ? 'updating' : 'submitting'} survey: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        first_name: '',
        last_name: '',
        street_address: '',
        city: '',
        state: '',
        zip: '',
        telephone: '',
        email: '',
        survey_date: today,
        liked_most: [],
        interest_source: '',
        recommendation: '',
        raffle: '',
        comments: ''
      })
      setRaffleError('')
    }
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
              <h2 className="text-success">{isEditMode ? 'Update Survey' : 'Student Survey Form'}</h2>
              <p className="lead">{isEditMode ? 'Update the survey information below' : 'Please fill out this survey to help us improve our university experience'}</p>
            </div>
                
            {/* Bootstrap form */}
            <form id="studentSurveyForm" onSubmit={handleSubmit} autoComplete="on">
                        
              {/* Required Personal Information */}
              <div className="mb-4">
                <h4 className="text-success mb-3">Personal Information <span className="text-danger">*</span></h4>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">First Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="firstName" 
                      name="first_name" 
                      ref={firstNameRef}
                      value={formData.first_name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="lastName" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="streetAddress" className="form-label">Street Address <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="streetAddress" 
                    name="street_address" 
                    placeholder="1234 Main St" 
                    value={formData.street_address}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label">City <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="city" 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="state" 
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="zip" className="form-label">ZIP Code <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="zip" 
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="telephone" className="form-label">Telephone Number <span className="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      id="telephone" 
                      name="telephone" 
                      placeholder="XXX-XXX-XXXX" 
                      value={formData.telephone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email Address <span className="text-danger">*</span></label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      name="email" 
                      placeholder="example@email.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="surveyDate" className="form-label">Date of Survey <span className="text-danger">*</span></label>
                  <input 
                    type="date" 
                    className="form-control" 
                    id="surveyDate" 
                    name="survey_date"
                    value={formData.survey_date}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* What you liked most about campus - Checkboxes */}
              <div className="mb-4">
                <h4 className="text-success mb-3">What did you like most about the campus?</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="students" 
                        id="students" 
                        name="likedMost"
                        checked={formData.liked_most.includes('students')}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="students">Students</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="location" 
                        id="location" 
                        name="likedMost"
                        checked={formData.liked_most.includes('location')}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="location">Location</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="campus" 
                        id="campus" 
                        name="likedMost"
                        checked={formData.liked_most.includes('campus')}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="campus">Campus</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="atmosphere" 
                        id="atmosphere" 
                        name="likedMost"
                        checked={formData.liked_most.includes('atmosphere')}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="atmosphere">Atmosphere</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="dormRooms" 
                        id="dormRooms" 
                        name="likedMost"
                        checked={formData.liked_most.includes('dormRooms')}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="dormRooms">Dorm Rooms</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="sports" 
                        id="sports" 
                        name="likedMost"
                        checked={formData.liked_most.includes('sports')}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="sports">Sports</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* How you became interested - Radio buttons */}
              <div className="mb-4">
                <h4 className="text-success mb-3">How did you become interested in the university?</h4>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="interest_source" 
                    id="friends" 
                    value="friends"
                    checked={formData.interest_source === 'friends'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="friends">Friends</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="interest_source" 
                    id="television" 
                    value="television"
                    checked={formData.interest_source === 'television'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="television">Television</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="interest_source" 
                    id="internet" 
                    value="internet"
                    checked={formData.interest_source === 'internet'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="internet">Internet</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="interest_source" 
                    id="other" 
                    value="other"
                    checked={formData.interest_source === 'other'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="other">Other</label>
                </div>
              </div>

              {/* Likelihood of recommending - Dropdown */}
              <div className="mb-4">
                <h4 className="text-success mb-3">How likely are you to recommend this school to other prospective students?</h4>
                <select 
                  className="form-select" 
                  id="recommendation" 
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option...</option>
                  <option value="veryLikely">Very Likely</option>
                  <option value="likely">Likely</option>
                  <option value="unlikely">Unlikely</option>
                </select>
              </div>

              {/* Raffle field */}
              <div className="mb-4">
                <h4 className="text-success mb-3">Raffle Entry</h4>
                <label htmlFor="raffle" className="form-label">Enter at least 10 comma-separated numbers (1-100) for a chance to win a free movie ticket:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="raffle" 
                  name="raffle" 
                  placeholder="1, 5, 10, 15, 20, 25, 30, 35, 40, 45" 
                  value={formData.raffle}
                  onChange={handleRaffleChange}
                  required 
                />
                <div className="form-text">Example: 1, 5, 10, 15, 20, 25, 30, 35, 40, 45</div>
                {raffleError && (
                  <div id="raffleError" className="text-danger mt-2">{raffleError}</div>
                )}
              </div>

              {/* Additional comments */}
              <div className="mb-4">
                <h4 className="text-success mb-3">Additional Comments</h4>
                <textarea 
                  className="form-control" 
                  id="comments" 
                  name="comments" 
                  rows="4" 
                  placeholder="Please share any additional thoughts or comments..."
                  value={formData.comments}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Submit and Cancel buttons */}
              <div className="d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg" 
                  onClick={isEditMode ? () => navigate(`/surveys/${id}`) : handleCancel}
                >
                  {isEditMode ? 'Cancel' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-warning btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Survey' : 'Submit Survey')}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Footer */}
      <div className="container">
        <footer className="py-3 my-4">
          <p className="text-center text-body-secondary">Made with ❤️ by Divyanshi, Yashwanth, and Aditi - SWE645 Assignment 3</p>
        </footer>
      </div>

    </main>
  )
}

export default StudentSurvey
