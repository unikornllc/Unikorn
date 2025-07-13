import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCompanyPermissions = () => {
  const [permissions, setPermissions] = useState({
    tier: null,
    isInvestor: false,
    canPost: false,
    canChat: false,
    canInvest: false,
    canRaiseFunds: false,
    loading: true,
    error: null
  });

  const fetchPermissions = async () => {
    try {
      setPermissions(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/getCompanyPermissions`,
        { withCredentials: true }
      );
      console.log('Fetched company permissions:', response.data.permissions);

      if (response.data.success) {
        setPermissions({
          ...response.data.permissions,
          loading: false,
          error: null
        });
      } else {
        throw new Error('Failed to fetch company permissions');
      }
    } catch (error) {
      console.error('Error fetching company permissions:', error);
      setPermissions({
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch company permissions'
      });
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const refreshPermissions = () => {
    fetchPermissions();
  };

  return {
    ...permissions,
    refreshPermissions
  };
};

// Helper function to get company feature requirements
export const getCompanyFeatureRequirements = (feature) => {
  const requirements = [];
  
  switch (feature) {
    case 'POSTING':
    case 'CHATTING':
      requirements.push('Hunter tier subscription');
      break;
    case 'INVESTING':
      requirements.push('Investor status');
      break;
    case 'RAISING_FUNDS':
      requirements.push('Hunter tier subscription');
      requirements.push('Investor status');
      break;
    default:
      break;
  }
  
  return requirements;
};

// Helper function to check if company can access a feature
export const canAccessCompanyFeature = (permissions, feature) => {
  switch (feature) {
    case 'POSTING':
      return permissions.canPost;
    case 'CHATTING':
      return permissions.canChat;
    case 'INVESTING':
      return permissions.canInvest;
    case 'RAISING_FUNDS':
      return permissions.canRaiseFunds;
    default:
      return false;
  }
}; 