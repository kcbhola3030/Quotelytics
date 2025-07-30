const Member = require('../../models/member');
const ZipCountyMap = require('../../models/zipCountyMap');
const PlanCountyMap = require('../../models/planCountyMap');
const Plan = require('../../models/plan');
const Premium = require('../../models/premium');

class OffMarketController {
  // Helper function to calculate age from date of birth
  static getAgeFromDOB(dob) {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // Main function to calculate off-market premiums for a member
  async calculateOffMarketPremiums(req, res) {
    try {
      const { memberId } = req.params;
      
      // Step 1: Get the member info
  const member = await Member.findOne({id: memberId});
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
  
      
const { date_of_birth, last_used_tobacco, zip_code } = member;
      const ideonMemberId = member.id;


// Calculate age from date_of_birth
      const age = OffMarketController.getAgeFromDOB(date_of_birth);
      
      // Fix tobacco use logic - declare outside the if block
      let tobacco_use = false;
      if (last_used_tobacco !== null) {
        tobacco_use = last_used_tobacco === 'yes' || last_used_tobacco === true;
      }
      // Step 2: Get County ID(s) from Zip Code
      console.log(zip_code);
const zipCountyMappings = await ZipCountyMap.find({ zip_code_id: zip_code });
      if (!zipCountyMappings.length) {
        return res.status(400).json({ error: 'No county found for this zip code' });
      }
      console.log(zipCountyMappings);
const county_ids = zipCountyMappings.map(z => z.county_id);
      console.log(county_ids);

      // Step 3: Get All Plan IDs in County
      const planCountyMappings = await PlanCountyMap.find({ 
        county_id: { $in: county_ids } 
      });
      const plan_ids = [...new Set(planCountyMappings.map(p => p.plan_id))];

      if (!plan_ids.length) {
        return res.status(400).json({ error: 'No plans available in this county' });
      }

      // Step 4: Get Plan Details and Premiums
      const plans = await Plan.find({ plan_id: { $in: plan_ids } });

      const premiums = await Promise.all(plans.map(async (plan) => {
        const premiumDoc = await Premium.findOne({ plan_id: plan.plan_id });
        if (!premiumDoc) return null;

        // Age key logic
        let ageKey = age <= 20 ? 'age_0' : age >= 65 ? 'age_65' : `age_${age}`;
        if (tobacco_use) ageKey += '_tobacco';
        
        
        let premiumAmount = premiumDoc.premiums.get(ageKey);
        // let maxPremium = Math.max(maxPremium, premiumAmount)

        if (premiumAmount === undefined) {
          premiumAmount = tobacco_use ? premiumDoc.single_tobacco : premiumDoc.single;
        }

        return {
          plan_id: plan.plan_id,
          plan_name: plan.name,
          carrier_name: plan.carrier_name,
          plan_type: plan.plan_type,
          level: plan.level,
          full_premium: premiumAmount,
          age_based_premium: premiumAmount,
          tobacco_surcharge: tobacco_use ? (premiumDoc.single_tobacco - premiumDoc.single) : 0,
          plan_details: {
            actuarial_value: plan.actuarial_value,
            hsa_eligible: plan.hsa_eligible,
            network: plan.network,
            benefits: plan.benefits
          },
          calculation_date: new Date()
        };
      }));

      const filteredPremiums = premiums.filter(Boolean);
      // console.log(filteredPremiums);
      let maxPremium = 0;
      if (filteredPremiums.length > 0) {
        maxPremium = Math.max(...filteredPremiums.map(premium => premium.full_premium));
      }

      // Step 5: Save to Member Model - only plan IDs
      const planIds = filteredPremiums.map(premium => premium.plan_id);
      await Member.findOneAndUpdate(
        {id:memberId},
        { off_market_plan_ids: planIds,
          off_market_premium: maxPremium
         },
        { new: true, runValidators: false }
      );

      // Return results
      res.json({
        member_id: memberId,
        member_info: {
          name: `${member.first_name} ${member.last_name}`,
          age: age,
          tobacco_use: tobacco_use,
          zip_code: zip_code
        },
        county_ids: county_ids,
        total_plans_found: filteredPremiums.length,
        off_market_premium: maxPremium,
        off_market_premiums: filteredPremiums
      });

    } catch (error) {
      console.error('Error in calculateOffMarketPremiums:', error);
      res.status(500).json({
        error: 'Failed to calculate off-market premiums',
        details: error.message
      });
    }
  }

  // Get off-market premiums for a member
  async getOffMarketPremiums(req, res) {
    try {
      const { memberId } = req.params;
      
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      res.json({
        member_id: memberId,
        off_market_premiums: member.off_market_premiums || []
      });

    } catch (error) {
      console.error('Error in getOffMarketPremiums:', error);
      res.status(500).json({
        error: 'Failed to get off-market premiums',
        details: error.message
      });
    }
  }

  // Clear off-market premiums for a member
  async clearOffMarketPremiums(req, res) {
    try {
      const { memberId } = req.params;
      
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      member.off_market_premiums = [];
      await member.save();

      res.json({
        message: 'Off-market premiums cleared successfully',
        member_id: memberId
      });

    } catch (error) {
      console.error('Error in clearOffMarketPremiums:', error);
      res.status(500).json({
        error: 'Failed to clear off-market premiums',
        details: error.message
      });
    }
  }
}

module.exports = new OffMarketController();