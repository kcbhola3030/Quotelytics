// src/components/members/MembersForm.jsx
import { useState } from 'react';
import { zipCodes } from '../../utils'; // Import zipCodes from utils
const { v4: uuidv4 } = require('uuid');
const randomId = uuidv4();
const MembersForm = ({ group, onSubmit, onClose }) => {
  const [memberData, setMemberData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M',
    household_income: '',
    household_size: '1',
    annual_salary: '',
    zip_code: '', // Added zip_code field
  });

  const [dependents, setDependents] = useState([]);
  const [newDependent, setNewDependent] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'F',
    relationship: 'spouse'
  });

  const [showDependentForm, setShowDependentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberData({
      ...memberData,
      [name]: value
    });
  };

  const handleDependentChange = (e) => {
    const { name, value } = e.target;
    setNewDependent({
      ...newDependent,
      [name]: value
    });
  };

  const addDependent = () => {
    if (newDependent.first_name && newDependent.last_name && newDependent.date_of_birth) {
      setDependents([...dependents, newDependent]);
      setNewDependent({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'F',
        relationship: 'spouse'
      });
      setShowDependentForm(false);
    }
  };

  const removeDependent = (index) => {
    const updatedDependents = dependents.filter((_, i) => i !== index);
    setDependents(updatedDependents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!memberData.first_name || !memberData.last_name || !memberData.date_of_birth || !memberData.zip_code) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    console.log(group)
    const payload = {
      location: {
        id: group.location.id,
        fips_code: group.location.fips_code || '36061',
        zip_code: memberData.zip_code // Use selected zip_code from form
      },
      memberData: {
        external_id: uuidv4(),
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        date_of_birth: memberData.date_of_birth,
        gender: memberData.gender,
        household_income: parseInt(memberData.household_income, 10) || 0,
        household_size: parseInt(memberData.household_size, 10) || 1,
        annual_salary: parseInt(memberData.annual_salary, 10) || 0,
        zip_code: memberData.zip_code, // Include zip_code in memberData
        dependents: dependents
      }
    };
    console.log(payload)
    onSubmit(payload)
      .then(() => {
        // Reset form on success
        setMemberData({
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: 'M',
          household_income: '',
          household_size: '1',
          annual_salary: '',
          zip_code: '', // Reset zip_code
        });
        setDependents([]);
      })
      .catch(err => {
        setError(err.message || 'Failed to add member');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Add New Member</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={memberData.first_name}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={memberData.last_name}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={memberData.date_of_birth}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={memberData.gender}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            {/* ZIP Code Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ZIP Code *
              </label>
              <select
                name="zip_code"
                value={memberData.zip_code}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select ZIP Code</option>
                {zipCodes.map((zipCode) => (
                  <option key={zipCode} value={zipCode}>
                    {zipCode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Information</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Annual Salary ($)
              </label>
              <input
                type="number"
                name="annual_salary"
                value={memberData.annual_salary}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Household Income ($)
              </label>
              <input
                type="number"
                name="household_income"
                value={memberData.household_income}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Household Size
              </label>
              <input
                type="number"
                name="household_size"
                value={memberData.household_size}
                onChange={handleMemberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Dependents Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">Dependents</h3>
            <button
              type="button"
              onClick={() => setShowDependentForm(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Dependent
            </button>
          </div>

          {showDependentForm && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3">New Dependent</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={newDependent.first_name}
                    onChange={handleDependentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={newDependent.last_name}
                    onChange={handleDependentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={newDependent.date_of_birth}
                    onChange={handleDependentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={newDependent.gender}
                    onChange={handleDependentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Relationship *
                  </label>
                  <select
                    name="relationship"
                    value={newDependent.relationship}
                    onChange={handleDependentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="domestic_partner">Domestic Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-3">
                <button
                  type="button"
                  onClick={() => setShowDependentForm(false)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addDependent}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Add Dependent
                </button>
              </div>
            </div>
          )}

          {dependents.length > 0 && (
            <div className="space-y-2">
              {dependents.map((dependent, index) => (
                <div key={index} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{dependent.first_name} {dependent.last_name}</p>
                    <p className="text-sm text-gray-600">
                      {dependent.relationship} • {dependent.gender === 'M' ? 'Male' : 'Female'} • {dependent.date_of_birth}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDependent(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MembersForm;