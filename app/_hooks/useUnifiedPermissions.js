import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUnifiedPermissions = () => {
  const [permissions, setPermissions] = useState({
    accountType: null,
    tier: null,
    isInvestor: false,
    canPost: false,
    canChat: false,
    canInvest: false,
    canRaiseFunds: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/getUserPermissions`,
          { withCredentials: true }
        );

        console.log('Fetched unified permissions:', response.data.permissions);

        if (response.data.success) {
          setPermissions(response.data.permissions);
        } else {
          throw new Error('Failed to fetch permissions');
        }
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError(err.response?.data?.message || 'Failed to fetch permissions');
        // Set default permissions on error
        setPermissions({
          accountType: null,
          tier: null,
          isInvestor: false,
          canPost: false,
          canChat: false,
          canInvest: false,
          canRaiseFunds: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const refreshPermissions = () => {
    fetchPermissions();
  };

  const checkPermission = (feature) => {
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

  const getUpgradeRequirements = (feature) => {
    const requirements = [];
    
    if (feature === 'POSTING' || feature === 'CHATTING') {
      if (permissions.accountType === 'company') {
        requirements.push('Hunter tier subscription');
      } else {
        requirements.push('Pro tier subscription');
      }
    }
    
    if (feature === 'INVESTING') {
      requirements.push('Investor status');
    }
    
    if (feature === 'RAISING_FUNDS') {
      if (permissions.accountType === 'company') {
        requirements.push('Hunter tier subscription');
      } else {
        requirements.push('Pro tier subscription');
      }
      requirements.push('Investor status');
    }
    
    return requirements;
  };

  const getAccountTypeLabel = () => {
    return permissions.accountType === 'company' ? 'Company' : 'User';
  };

  const getTierLabel = () => {
    if (permissions.accountType === 'company') {
      return permissions.tier === 'Hunter' ? 'Hunter' : 'Holder';
    } else {
      return permissions.tier === 'Pro' ? 'Pro' : 'Standard';
    }
  };

  const getUpgradeMessage = (feature) => {
    const accountType = getAccountTypeLabel();
    const tier = getTierLabel();
    
    if (feature === 'POSTING' || feature === 'CHATTING') {
      if (permissions.accountType === 'company' && permissions.tier === 'Holder') {
        return `Upgrade to Hunter tier to access ${feature.toLowerCase()}`;
      }
      if (permissions.accountType === 'user' && permissions.tier === 'Standard') {
        return `Upgrade to Pro tier to access ${feature.toLowerCase()}`;
      }
    }
    
    if (feature === 'INVESTING') {
      if (!permissions.isInvestor) {
        return `Get investor status to access investing features`;
      }
    }
    
    if (feature === 'RAISING_FUNDS') {
      if (!permissions.isInvestor) {
        return `Get investor status to raise funds`;
      }
      if (permissions.accountType === 'company' && permissions.tier === 'Holder') {
        return `Upgrade to Hunter tier and get investor status to raise funds`;
      }
      if (permissions.accountType === 'user' && permissions.tier === 'Standard') {
        return `Upgrade to Pro tier and get investor status to raise funds`;
      }
    }
    
    return `Upgrade your account to access ${feature.toLowerCase()}`;
  };

  return {
    permissions,
    loading,
    error,
    checkPermission,
    getUpgradeRequirements,
    getAccountTypeLabel,
    getTierLabel,
    getUpgradeMessage,
    refreshPermissions,
    isUser: permissions.accountType === 'user',
    isCompany: permissions.accountType === 'company',
    isPro: permissions.tier === 'Pro' || permissions.tier === 'Hunter',
    isStandard: permissions.tier === 'Standard' || permissions.tier === 'Holder',
    isInvestor: permissions.isInvestor
  };
}; 