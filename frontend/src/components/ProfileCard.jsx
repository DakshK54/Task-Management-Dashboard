import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const ProfileCard = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/profile', formData)
      updateUser(response.data.user)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
    setError('')
  }

  if (!user) {
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>
  }

  return (
    <div className="card sticky top-4">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
        bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-2xl font-bold mb-2">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200
         dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg text-sm">
          {success}
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Name</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 btn-secondary"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
             text-red-700 dark:text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="profile-name" className="label">
              Name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="label">
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfileCard
