import { useState } from 'react';

const QuotationComparison = ({ members, ichraResults, onClose }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Calculate all comparison data
  const calculateComparisons = () => {
    let employerOldTotal = 0;
    let employerNewTotal = 0;
    let employeeOldTotal = 0;
    let employeeNewTotal = 0;

    const employeeDetails = members.map(member => {
      const ichraResult = ichraResults?.find(r => r.member_external_id === member.id);
      
      // Old Plan Calculations
      const oldEmployerPays = member.off_market_premium ? member.off_market_premium * 0.7 : 0;
      const oldEmployeePays = member.off_market_premium ? member.off_market_premium * 0.3 : 0;
      
      // New Plan Calculations
      const premium = parseFloat(ichraResult?.plan?.premium || 0);
      const taxCredit = parseFloat(ichraResult?.premium_tax_credit || 0);
      const fplContribution = parseFloat(ichraResult?.fpl_minimum_employer_contribution || 0);
      
      const afterTaxCredit = Math.max(0, premium - taxCredit);
      const newEmployerPays = Math.min(afterTaxCredit, fplContribution);
      const newEmployeePays = Math.max(0, afterTaxCredit - newEmployerPays);
      
      // Accumulate totals
      employerOldTotal += oldEmployerPays;
      employerNewTotal += newEmployerPays;
      employeeOldTotal += oldEmployeePays;
      employeeNewTotal += newEmployeePays;

      return {
        name: `${member.first_name} ${member.last_name}`,
        oldFullPremium: member.off_market_premium?.toFixed(2) || '0.00',
        oldEmployerPays: oldEmployerPays.toFixed(2),
        oldEmployeePays: oldEmployeePays.toFixed(2),
        newFullPremium: premium.toFixed(2),
        taxCredit: taxCredit.toFixed(2),
        newEmployerPays: newEmployerPays.toFixed(2),
        newEmployeePays: newEmployeePays.toFixed(2),
        employerMonthlySavings: (oldEmployerPays - newEmployerPays).toFixed(2),
        employeeMonthlySavings: (oldEmployeePays - newEmployeePays).toFixed(2)
      };
    });

    return {
      employeeDetails,
      totals: {
        employerOldTotal: employerOldTotal.toFixed(2),
        employerNewTotal: employerNewTotal.toFixed(2),
        employeeOldTotal: employeeOldTotal.toFixed(2),
        employeeNewTotal: employeeNewTotal.toFixed(2),
        employerMonthlySavings: (employerOldTotal - employerNewTotal).toFixed(2),
        employerAnnualSavings: ((employerOldTotal - employerNewTotal) * 12).toFixed(2),
        employeeMonthlySavings: (employeeOldTotal - employeeNewTotal).toFixed(2),
        employeeAnnualSavings: ((employeeOldTotal - employeeNewTotal) * 12).toFixed(2)
      }
    };
  };

  const { employeeDetails, totals } = calculateComparisons();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Insurance Plan Comparison</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
          </div>

          {/* Employee Comparison Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th rowSpan="2" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  
                  <th colSpan="3" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Old Plan</th>
                  <th colSpan="4" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">New Plan</th>
                  <th colSpan="2" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Monthly Savings</th>
                </tr>
                <tr>
                  {/* Old Plan Subheaders */}
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Full Premium</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Employer Pays</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Pays</th>
                  
                  {/* New Plan Subheaders */}
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Full Premium</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Credit</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Employer Pays</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Pays</th>
                  
                  {/* Savings Subheaders */}
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeDetails.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                    
                    {/* Old Plan */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.oldFullPremium}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.oldEmployerPays}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.oldEmployeePays}</td>
                    
                    {/* New Plan */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.newFullPremium}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.taxCredit}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.newEmployerPays}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${employee.newEmployeePays}</td>
                    
                    {/* Savings */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                      parseFloat(employee.employerMonthlySavings) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${employee.employerMonthlySavings}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                      parseFloat(employee.employeeMonthlySavings) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${employee.employeeMonthlySavings}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold">
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">Totals</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">-</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">${totals.employerOldTotal}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">${totals.employeeOldTotal}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">-</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">-</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">${totals.employerNewTotal}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">${totals.employeeNewTotal}</td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                    parseFloat(totals.employerMonthlySavings) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totals.employerMonthlySavings}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                    parseFloat(totals.employeeMonthlySavings) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totals.employeeMonthlySavings}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Employer Savings */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Employer Savings Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Monthly Savings</p>
                  <p className={`text-2xl font-bold ${
                    parseFloat(totals.employerMonthlySavings) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totals.employerMonthlySavings}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Annual Savings</p>
                  <p className={`text-2xl font-bold ${
                    parseFloat(totals.employerAnnualSavings) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totals.employerAnnualSavings}
                  </p>
                </div>
              </div>
            </div>

            {/* Employee Savings */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Employee Savings Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-600">Monthly Savings</p>
                  <p className={`text-2xl font-bold ${
                    parseFloat(totals.employeeMonthlySavings) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totals.employeeMonthlySavings}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Annual Savings</p>
                  <p className={`text-2xl font-bold ${
                    parseFloat(totals.employeeAnnualSavings) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totals.employeeAnnualSavings}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationComparison;