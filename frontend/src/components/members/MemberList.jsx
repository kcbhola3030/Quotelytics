// src/components/members/MembersList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import QuotationComparison from '../QuotationComparison';


const MembersList = ({ members, loading, groupId, onMemberAdded }) => {
  const [calculating, setCalculating] = useState(null);
  const [error, setError] = useState(null);
  const [ichraCalculation, setIchraCalculation] = useState(null);
  const [ichraResults, setIchraResults] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isGettingIchra, setIsGettingIchra] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const calculateOffMarketPremium = async (memberId) => {
    try {
      setCalculating(memberId);
      setError(null);
      
      const response = await axios.post(
        `http://localhost:4000/api/offMarket/calculate/${memberId}`
      );
      
      onMemberAdded({
        member_id: response.data.member_id,
        off_market_premium: response.data.off_market_premium,
        ichra_affordability_results: response.data.ichra_affordability_results
      });
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
      
      for (const member of members) {
        if (!member.off_market_premium) {
          const response = await axios.post(
            `http://localhost:4000/api/offMarket/calculate/${member.id}`
          );
          onMemberAdded({
            member_id: response.data.member_id,
            off_market_premium: response.data.off_market_premium,
            ichra_affordability_results: response.data.ichra_affordability_results
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate premiums');
    } finally {
      setCalculating(null);
    }
  };

  // Step 1: Create ICHRA calculation
  const createIchraCalculation = async () => {
    try {
      setError(null);
      
      const response = await axios.post(
        `http://localhost:4000/api/ichra/groups/${groupId}/calculations`,
        {
          ichra_affordability_calculation: {
            effective_date: "2025-08-01",
            plan_year: 2025,
            rating_area_location: "work"
          }
        }
      );
      
      setIchraCalculation(response.data.calculation.ichra_affordability_calculation);
      setCountdown(10); // Start 10-second countdown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ICHRA calculation');
    }
  };

// Step 2: Get ICHRA results
const getIchraResults = async () => {
  if (!ichraCalculation?.id) return;
  
  try {
    setIsGettingIchra(true);
    setError(null);
    
    const response = await axios.get(
      `http://localhost:4000/api/ichra/members/${ichraCalculation.id}`
    );
    
    // Just store the results array directly
    const results = Array.isArray(response.data) ? response.data : response.data.results || [];
    setIchraResults(results);
    console.log(members)
    console.log(results)
    
  } catch (err) {
    console.error('ICHRA Results Error:', err);
    setError(err.response?.data?.message || 'Failed to get ICHRA results');
  } finally {
    setIsGettingIchra(false);
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
          
          {/* ICHRA Calculation Flow */}
          {!ichraCalculation ? (
            <button
              onClick={createIchraCalculation}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-sm"
            >
              Calculate On-Market
            </button>
          ) : ichraCalculation.status === 'pending' ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                ICHRA ID: {ichraCalculation.id}
              </span>
              <span className="text-sm text-orange-600">
                Status: {ichraCalculation.status}
              </span>
              <button
                onClick={getIchraResults}
                disabled={countdown > 0 || isGettingIchra}
                className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 text-sm"
              >
                {isGettingIchra ? 'Getting Results...' : 
                 countdown > 0 ? `Get ICHRA (${countdown}s)` : 'Get ICHRA'}
              </button>
            </div>
          ) : (
            <span className="text-sm text-green-600">
              ICHRA Complete: {ichraCalculation.id}
            </span>
          )}

<button
  onClick={() => setShowComparison(true)}
  disabled={!members.every(m => m.off_market_premium) || !ichraResults}
  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 text-sm"
>
  Show Comparison
</button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {members && members.map((member) => {
        // Find matching ICHRA result for this member
        const ichraResult = ichraResults?.find(result => 
          result.member_external_id === member.id
        );
        
        return (
          // <div key={member.id} className="border rounded-lg p-4">
          //   <div className="flex justify-between items-start">
          //     <div>
          //       <h4 className="font-medium">
          //         {member.first_name} {member.last_name}
          //       </h4>
          //       <p className="text-sm text-gray-600">
          //         {member.gender === 'M' ? 'Male' : 'Female'} • DOB: {member.date_of_birth}
          //       </p>
                
          //       {/* Off-Market Premium */}
          //       {member.off_market_premium && (
          //         <p className="text-sm text-green-600 mt-1">
          //           Off-Market Premium: ${member.off_market_premium.toFixed(2)}
          //         </p>
          //       )}
                
          //       {/* On-Market Premium - Display directly from results */}
          //       {ichraResult && (
          //         <div className="mt-2 p-2 bg-blue-50 rounded border">
          //           <p className="text-sm font-medium text-blue-800">On-Market Result:</p>
          //           <p className="text-sm text-blue-600 mt-1">
          //             Premium: ${ichraResult.plan.premium}
          //           </p>
          //         </div>
          //       )}
          //     </div>
              
          //     <div className="flex space-x-2">
          //       {!member.off_market_premium && (
          //         <button
          //           onClick={() => calculateOffMarketPremium(member.id)}
          //           disabled={loading || calculating === member.id}
          //           className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-xs"
          //         >
          //           {calculating === member.id ? 'Calculating...' : 'Off-Market'}
          //         </button>
          //       )}
          //     </div>
          //   </div>

          //   {member.dependents?.length > 0 && (
          //     <div className="mt-2">
          //       <p className="text-xs text-gray-500">Dependents: {member.dependents.length}</p>
          //     </div>
          //   )}
          // </div>

          <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
  <div className="flex justify-between items-start gap-4">
    {/* Left side - Member info and off-market premium */}
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2">
        <h4 className="font-medium text-gray-900 truncate">
          {member.first_name} {member.last_name}
        </h4>
        <span className="text-xs text-gray-500">
          {member.dependents?.length > 0 ? `+${member.dependents.length} dependents` : ''}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mt-1">
        {member.gender === 'M' ? 'Male' : 'Female'} • DOB: {member.date_of_birth}
      </p>
      
      {member.off_market_premium && (
        <div className="mt-2 inline-block">
          <span className="text-xs font-medium text-gray-500">Off-Market:</span>
          <span className="ml-2 text-sm font-semibold text-green-600">
            ${member.off_market_premium.toFixed(2)}
          </span>
        </div>
      )}
    </div>

    {/* Right side - On-market premium and action button */}
    <div className="flex flex-col items-end gap-2">
      {ichraResult && (
        <div className="text-right">
          <span className="text-xs font-medium text-gray-500">On-Market:</span>
          <p className="text-sm font-semibold text-blue-600">
          ${(ichraResult.plan?.premium || 0)}
          </p>
        </div>
      )}

      {!member.off_market_premium && (
        <button
          onClick={() => calculateOffMarketPremium(member.id)}
          disabled={loading || calculating === member.id}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-xs whitespace-nowrap transition-colors"
        >
          {calculating === member.id ? 'Calculating...' : 'Calculate Off-Market'}
        </button>
      )}
    </div>
  </div>
</div>
        );
      })}
  {showComparison && (
  <QuotationComparison
    members={members}
    ichraResults={ichraResults}
    onClose={() => setShowComparison(false)}
  />
)}    
    </div>
  
);
};

export default MembersList;