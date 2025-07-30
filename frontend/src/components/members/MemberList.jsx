// src/components/members/MembersList.jsx
import { useState } from 'react';
import axios from 'axios';
// import member from '../../../../backend/models/member';

const MembersList = ({ members, loading, groupId, onMemberUpdated }) => {
    console.log(members)
  const [calculating, setCalculating] = useState(null);
  const [error, setError] = useState(null);

  const calculateOffMarketPremium = async (memberId) => {
    try {
      setCalculating(memberId);
      setError(null);
      
      const response = await axios.post(
        `http://localhost:4000/api/offMarket/calculate/${memberId}`
      );
      
      // Update the member with the new premium data
      onMemberUpdated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate premium');
    } finally {
      setCalculating(null);
    }
  };

  const calculateAllOffMarket = async () => {
    try {
      setCalculating('all');
      setError(null);
      
      // Calculate premiums one by one
      for (const member of members) {
        if (!member.off_market_premium) {
          const response = await axios.post(
            `http://localhost:4000/api/offMarket/calculate/${member.id}`
          );
          onMemberUpdated(response.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate premiums');
    } finally {
      setCalculating(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Members</h3>
        <div className="flex space-x-2">
          <button
            onClick={calculateAllOffMarket}
            disabled={loading || calculating === 'all'}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 text-sm"
          >
            {calculating === 'all' ? 'Calculating...' : 'Calculate All Off-Market'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {members.map((member) => (

        <div key={member.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">
                {member.first_name} {member.last_name} {member.off_market_premium}
              </h4>
              <p className="text-sm text-gray-600">
                {member.gender === 'M' ? 'Male' : 'Female'} • DOB: {member.date_of_birth}
              </p>
              {member.off_market_premium && (
                <p className="text-sm text-green-600 mt-1">
                  Off-Market Premium: ${member.off_market_premium.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {!member.off_market_premium && (
                <button
                  onClick={() => calculateOffMarketPremium(member.id)}
                  disabled={loading || calculating === member.id}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-xs"
                >
                  {calculating === member.id ? 'Calculating...' : 'Calculate Premium'}
                </button>
              )}
            </div>
          </div>

          {member.dependents?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Dependents: {member.dependents.length}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MembersList;