// src/components/groups/GroupForm.jsx
import { useState } from 'react';
import zipcodes from 'zipcodes-nrviens';

const GroupForm = ({ groupData, onInputChange, onSubmit, loading }) => {
  const [locations, setLocations] = useState(
    groupData.locations || [
      {
        name: '',
        number_of_employees: 0,
        zip_code: '',
        fips_code: '',
        city: '',
        state: '',
        county: ''
      }
    ]
  );

  const handleLocationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLocations = [...locations];
    
    updatedLocations[index][name] = value;
    
    // Auto-fill location details when zip code changes
    if (name === 'zip_code') {
      const zipInfo = zipcodes.lookup(value);
      if (zipInfo) {
        updatedLocations[index].fips_code = zipInfo.fips;
        updatedLocations[index].city = zipInfo.city;
        updatedLocations[index].state = zipInfo.state;
        updatedLocations[index].county = zipInfo.county;
      } else {
        updatedLocations[index].fips_code = '';
        updatedLocations[index].city = '';
        updatedLocations[index].state = '';
        updatedLocations[index].county = '';
      }
    }
    
    setLocations(updatedLocations);
    onInputChange({ target: { name: 'locations', value: updatedLocations } });
  };

  const addLocation = () => {
    setLocations([
      ...locations,
      {
        name: '',
        number_of_employees: 0,
        zip_code: '',
        fips_code: '',
        city: '',
        state: '',
        county: ''
      }
    ]);
  };

  const removeLocation = (index) => {
    if (locations.length > 1) {
      const updatedLocations = locations.filter((_, i) => i !== index);
      setLocations(updatedLocations);
      onInputChange({ target: { name: 'locations', value: updatedLocations } });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        {groupData.id ? 'Edit Group' : 'Create New Group'}
      </h2>
      <form onSubmit={onSubmit}>
        {/* Company Information */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Company Information</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company_name">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={groupData.company_name}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_email">
                Email *
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={groupData.contact_email}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_phone">
                Contact Phone * (Format: 123-123-1234)
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={groupData.contact_phone}
                onChange={(e) => {
                  // Format phone number as user types
                  let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                  if (value.length <= 3) {
                    value = value;
                  } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                  } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                  }
                  onInputChange({ target: { name: 'contact_phone', value } });
                }}
                placeholder="123-123-1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="12"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_name">
                Contact Name
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={groupData.contact_name}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sic_code">
                SIC Code (4-digit) *
              </label>
              <input
                type="text"
                id="sic_code"
                name="sic_code"
                value={groupData.sic_code}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="\d{4}"
                title="4-digit SIC code"
                required
              />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">Locations</h3>
            <button
              type="button"
              onClick={addLocation}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Location
            </button>
          </div>

          {locations.map((location, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Location {index + 1}</h4>
                {locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={location.name}
                    onChange={(e) => handleLocationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={location.zip_code}
                    onChange={(e) => handleLocationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    pattern="\d{5}"
                    title="5-digit ZIP code"
                  />
                  {location.city && (
                    <p className="text-xs text-gray-500 mt-1">
                      {location.city}, {location.state} • {location.county} County • FIPS: {location.fips_code}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Number of Employees *
                  </label>
                  <input
                    type="number"
                    name="number_of_employees"
                    value={location.number_of_employees}
                    onChange={(e) => handleLocationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Processing...' : (groupData.id ? 'Update Group' : 'Create Group')}
        </button>
      </form>
    </div>
  );
};

export default GroupForm;