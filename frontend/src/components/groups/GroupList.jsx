// src/components/groups/GroupsList.jsx
import { Link } from 'react-router-dom';

const GroupsList = ({ groups, onEdit, onDelete, loading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Groups</h2>
      {loading && groups.length === 0 ? (
        <p className="text-gray-500">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500">No groups created yet. Create your first group!</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <Link to={`/groups/${group.id}`} className="block">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{group.company_name}</h3>
                    <p className="text-sm text-gray-600">Email: {group.contact_email}</p>
                    <p className="text-sm text-gray-600">Phone: {group.contact_phone}</p>
                    {group.contact_name && (
                      <p className="text-sm text-gray-600">Contact: {group.contact_name}</p>
                    )}
                    <p className="text-sm text-gray-600">SIC: {group.sic_code}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(group.id);
                      }} 
                      className="text-blue-600 hover:text-blue-900 text-sm"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(group.id);
                      }} 
                      className="text-red-600 hover:text-red-900 text-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h4 className="font-medium text-gray-700 text-sm">Locations:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {group.locations.map((loc, idx) => (
                      <li key={idx}>
                        {loc.name} ({loc.zip_code}) - {loc.number_of_employees} employees
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsList;