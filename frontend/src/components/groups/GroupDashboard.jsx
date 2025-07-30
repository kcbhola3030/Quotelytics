// src/components/groups/GroupsDashboard.jsx
import { useState, useEffect } from 'react';
import GroupForm from './GroupForm';
import GroupsList from './GroupList';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');
const randomId = uuidv4();

const GroupsDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newGroup, setNewGroup] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    contact_name: '',
    sic_code: '',
    locations: [
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
  });

  // Fetch groups from API
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/groups');
      setGroups(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch groups. Please try again.');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({
      ...newGroup,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare the payload according to your API requirements
      const payload = {
        group: {
          chamber_association: true,
        company_name: newGroup.company_name,
        contact_email: newGroup.contact_email,
          contact_name: newGroup.contact_name || "",
          contact_phone: newGroup.contact_phone || "123-456-7890",
          external_id:uuidv4(),
          sic_code: newGroup.sic_code || ""
        },
        locations: newGroup.locations.map(loc => ({
          fips_code: loc.fips_code,
          name: loc.name,
          number_of_employees: parseInt(loc.number_of_employees, 10),
          primary: true,
          zip_code: loc.zip_code
        }))
      };
      console.log(payload)
      const method = newGroup.id ? 'put' : 'post';
      const url = newGroup.id 
        ? `http://localhost:4000/api/groups/${newGroup.id}`
        : 'http://localhost:4000/api/groups';
      
      const response = await axios[method](url, payload);

      // After successful creation/update, refresh the groups list
      await fetchGroups();

      // Reset form
      setNewGroup({
        company_name: '',
        contact_email: '',
        contact_phone: '',
        contact_name: '',
        sic_code: '',
        locations: [
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
      });
    } catch (err) {
      setError('Failed to save group. Please try again.');
      console.error('Error saving group:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mongoId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4000/api/groups/${mongoId}`);
      setGroups(groups.filter(group => group._id !== mongoId));
    } catch (err) {
      setError('Failed to delete group. Please try again.');
      console.error('Error deleting group:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const groupToEdit = groups.find(group => group.id === id);
    setNewGroup({
      ...groupToEdit,
      locations: groupToEdit.locations.length > 0 
        ? groupToEdit.locations 
        : [
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
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <GroupForm 
          groupData={newGroup}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      
      <div className="w-full md:w-1/2">
        <GroupsList 
          groups={groups} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default GroupsDashboard;