// src/pages/GroupDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MembersForm from '../../components/groups/MemberForm';
import MembersList from '../../components/members/MemberList';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);

//   useEffect(() => {
//     const fetchGroupAndMembers = async () => {
//       try {
//         setLoading(true);
//         const [groupRes, membersRes] = await Promise.all([
//           axios.get(`http://localhost:4000/api/groups/${groupId}`),
//           axios.get(`http://localhost:4000/api/groups/${groupId}/members`)
//         ]);
//         setGroup(groupRes.data);
//         setMembers(membersRes.data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to load group data. Please try again.');
//         console.error('Error fetching group details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroupAndMembers();
//   }, [groupId]);

//   const handleAddMember = async (memberData) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `http://localhost:4000/api/groups/${groupId}/members`,
//         memberData
//       );
//       setMembers([...members, response.data]);
//       setShowMemberForm(false);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add member. Please try again.');
//       console.error('Error adding member:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

useEffect(() => {
    const fetchGroupAndMembers = async () => {

        // /groups/mongo/:id
      try {
        setLoading(true);
        const [groupRes, membersRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/groups/mongo/${groupId}`),
          axios.get(`http://localhost:4000/api/groups/${groupId}/members`)
        ]);
        setGroup(groupRes.data);
        console.log(groupId)
        
        // Handle both array and object responses from API
        const membersData = Array.isArray(membersRes.data) 
          ? membersRes.data 
          : membersRes.data.members || [];
        setMembers(membersData);
        
        setError(null);
      } catch (err) {
        setError('Failed to load group data. Please try again.');
        console.error('Error fetching group details:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGroupAndMembers();
  }, [groupId]);
  
  const handleAddMember = async (memberData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4000/api/groups/${groupId}/members`,
        memberData
      );
      
      // Handle the response data properly
      const newMember = response.data.member || response.data;
      setMembers([...members, newMember]);
      setShowMemberForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member. Please try again.');
      console.error('Error adding member:', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading && !group) {
    return <div className="container mx-auto px-4 py-8">Loading group details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  if (!group) {
    return <div className="container mx-auto px-4 py-8">Group not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/groups" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Groups
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{group.company_name}</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Group Details</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Name:</span> {group.company_name}</p>
              <p><span className="font-medium">Phone:</span> {group.contact_phone}</p>
              {group.contact_name && (
                <p><span className="font-medium">Contact:</span> {group.contact_name}</p>
              )}
              <p><span className="font-medium">SIC Code:</span> {group.sic_code}</p>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-3 text-blue-600">Locations</h3>
            <ul className="space-y-2">
              {group.locations.map((location, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-600">
                    {location.zip_code} • {location.number_of_employees} employees
                  </p>
                  {location.fips_code && (
                    <p className="text-xs text-gray-500">FIPS: {location.fips_code}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600">Members</h2>
              <button
                onClick={() => setShowMemberForm(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Member
              </button>
            </div>

            {showMemberForm && (
              <MembersForm 
                group={group} 
                onSubmit={handleAddMember} 
                onClose={() => setShowMemberForm(false)}
              />
            )}

<MembersList 
  members={members} 
  loading={loading} 
  groupId={groupId}
  onMemberAdded={(updatedMemberData) => {
    // Handle off-market updates (existing logic)
    if (updatedMemberData && updatedMemberData.member_id && updatedMemberData.off_market_premium !== undefined) {
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === updatedMemberData.member_id 
            ? { ...member, off_market_premium: updatedMemberData.off_market_premium }
            : member
        )
      );
    }
    // Handle on-market updates (new logic)
    else if (updatedMemberData && updatedMemberData.member_external_id && updatedMemberData.ichra_affordability_results) {
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.external_id === updatedMemberData.member_external_id
            ? { ...member, ichra_affordability_results: updatedMemberData.ichra_affordability_results }
            : member
        )
      );
    }
    else {
      // Fallback: refetch all members if we don't have specific member data
      axios.get(`http://localhost:4000/api/groups/${groupId}/members`)
        .then(res => {
          const membersData = Array.isArray(res.data) 
            ? res.data 
            : res.data.members || [];
          setMembers(membersData);
        })
        .catch(err => console.error('Error fetching members:', err));
    }
  }}
/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;