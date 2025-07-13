import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePermissions = () => {
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
        `${process.env.NEXT_PUBLIC_SERVER}/api/getUserPermissions`,
        { withCredentials: true }
      );
      console.log('Fetched permissions:', response.data.permissions);

      if (response.data.success) {
        setPermissions({
          ...response.data.permissions,
          loading: false,
          error: null
        });
      } else {
        throw new Error('Failed to fetch permissions');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions({
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch permissions'
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

// Helper function to get feature requirements
export const getFeatureRequirements = (feature) => {
  const requirements = [];
  
  switch (feature) {
    case 'POSTING':
    case 'CHATTING':
      requirements.push('Pro tier subscription');
      break;
    case 'INVESTING':
      requirements.push('Investor status');
      break;
    case 'RAISING_FUNDS':
      requirements.push('Pro tier subscription');
      requirements.push('Investor status');
      break;
    default:
      break;
  }
  
  return requirements;
};

// Helper function to check if user can access a feature
export const canAccessFeature = (permissions, feature) => {
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