import prisma from "../db.js";

// User feature permission configuration
const USER_FEATURE_PERMISSIONS = {
  POSTING: {
    Standard: { 'false': false, 'true': true },
    Pro: { 'false': true, 'true': true }
  },
  CHATTING: {
    Standard: { 'false': false, 'true': true },
    Pro: { 'false': true, 'true': true }
  },
  INVESTING: {
    Standard: { 'false': false, 'true': true },
    Pro: { 'false': false, 'true': true }
  },
  RAISING_FUNDS: {
    Standard: { 'false': false, 'true': false },
    Pro: { 'false': false, 'true': true }
  }
};

// Company feature permission configuration
const COMPANY_FEATURE_PERMISSIONS = {
  POSTING: {
    Holder: { 'false': false, 'true': false },
    Hunter: { 'false': true, 'true': true }
  },
  CHATTING: {
    Holder: { 'false': false, 'true': true },
    Hunter: { 'false': true, 'true': true }
  },
  INVESTING: {
    Holder: { 'false': false, 'true': true },
    Hunter: { 'false': false, 'true': true }
  },
  RAISING_FUNDS: {
    Holder: { 'false': false, 'true': false },
    Hunter: { 'false': true, 'true': false }
  }
};

// Helper function to check if user has permission for a specific feature
export const hasUserFeaturePermission = (userTier, isInvestor, feature) => {
  const permission = USER_FEATURE_PERMISSIONS[feature];
  if (!permission) return false;
  
  const investorKey = isInvestor ? 'true' : 'false';
  return permission[userTier]?.[investorKey] || false;
};

// Helper function to check if company has permission for a specific feature
export const hasCompanyFeaturePermission = (companyTier, isInvestor, feature) => {
  const permission = COMPANY_FEATURE_PERMISSIONS[feature];
  if (!permission) return false;
  
  const investorKey = isInvestor ? 'true' : 'false';
  return permission[companyTier]?.[investorKey] || false;
};

// Unified function to check permissions for any account type
export const hasFeaturePermission = (accountType, tier, isInvestor, feature) => {
  if (accountType === 'user') {
    return hasUserFeaturePermission(tier, isInvestor, feature);
  } else if (accountType === 'company') {
    return hasCompanyFeaturePermission(tier, isInvestor, feature);
  }
  return false;
};

function getFeatureErrorMessage(feature, account, accountType) {
  const tier = account.tier;
  const isInvestor = account.isInvestor;
  
  if (feature === 'INVESTING') {
    if (!isInvestor) {
      return `Access denied. Investing is only available to ${accountType === 'company' ? 'companies' : 'users'} with investor status.`;
    }
    if (accountType === 'user' && tier === 'Standard') {
      return "Access denied. Investing is only available to Pro tier users.";
    }
    if (accountType === 'company' && tier === 'Holder') {
      return "Access denied. Investing is only available to Hunter tier companies.";
    }
  }
  
  if (feature === 'POSTING' || feature === 'CHATTING') {
    if (accountType === 'user' && tier === 'Standard') {
      return "Access denied. This feature requires a Pro tier subscription.";
    }
    if (accountType === 'company' && tier === 'Holder') {
      return "Access denied. This feature requires a Hunter tier subscription.";
    }
  }
  
  if (feature === 'RAISING_FUNDS') {
    if (accountType === 'company') {
      if (account.isInvestor) {
        return "Access denied. Raising funds is not available to investor companies.";
      }
      if (account.tier === 'Holder') {
        return "Access denied. Raising funds requires a Hunter tier subscription.";
      }
    } else if (accountType === 'user' && tier === 'Standard') {
      return "Access denied. Raising funds requires a Pro tier subscription and investor status.";
    }
    if (!isInvestor) {
      return `Access denied. Raising funds requires investor status.`;
    }
  }
  
  return "Access denied. You do not have permission to access this feature.";
}

// Unified middleware to check feature permissions for both users and companies
export const requireFeaturePermission = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.account || !req.account.id) {
        return res.status(401).json({ 
          message: "Authentication required",
          error: "UNAUTHORIZED"
        });
      }

      // First try to find a user account
      let user = await prisma.user.findUnique({
        where: { id: req.account.id },
        select: { tier: true, isInvestor: true }
      });

      let accountType = null;
      let account = null;

      if (user) {
        accountType = 'user';
        account = user;
      } else {
        // If no user found, try to find a company account
        const company = await prisma.company.findUnique({
          where: { id: req.account.id },
          select: { tier: true, isInvestor: true }
        });

        if (company) {
          accountType = 'company';
          account = company;
        }
      }

      if (!account) {
        return res.status(404).json({ 
          message: "Account not found",
          error: "ACCOUNT_NOT_FOUND"
        });
      }

      const hasPermission = hasFeaturePermission(accountType, account.tier, account.isInvestor, feature);
      
      if (!hasPermission) {
        return res.status(403).json({
          message: getFeatureErrorMessage(feature, account, accountType),
          error: "INSUFFICIENT_PERMISSIONS",
          requiredUpgrade: {
            accountType,
            tier: accountType === 'user' 
              ? (account.tier === 'Standard' ? 'Pro' : account.tier)
              : (account.tier === 'Holder' ? 'Hunter' : account.tier),
            isInvestor: !account.isInvestor
          }
        });
      }

      // Add unified permissions to request object
      req.accountPermissions = {
        accountType,
        tier: account.tier,
        isInvestor: account.isInvestor,
        canPost: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'POSTING'),
        canChat: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'CHATTING'),
        canInvest: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'INVESTING'),
        canRaiseFunds: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'RAISING_FUNDS')
      };

      next();
    } catch (error) {
      console.error('Error checking feature permissions:', error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: "PERMISSION_CHECK_FAILED"
      });
    }
  };
};

// Unified middleware to get permissions without blocking
export const getAccountPermissions = async (req, res, next) => {
  try {
    if (!req.account || !req.account.id) {
      req.accountPermissions = {
        accountType: null,
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false
      };
      return next();
    }

    // First try to find a user account
    let user = await prisma.user.findUnique({
      where: { id: req.account.id },
      select: { tier: true, isInvestor: true }
    });

    let accountType = null;
    let account = null;

    if (user) {
      accountType = 'user';
      account = user;
    } else {
      // If no user found, try to find a company account
      const company = await prisma.company.findUnique({
        where: { id: req.account.id },
        select: { tier: true, isInvestor: true }
      });

      if (company) {
        accountType = 'company';
        account = company;
      }
    }

    if (!account) {
      req.accountPermissions = {
        accountType: null,
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false
      };
      return next();
    }

    req.accountPermissions = {
      accountType,
      tier: account.tier,
      isInvestor: account.isInvestor,
      canPost: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'POSTING'),
      canChat: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'CHATTING'),
      canInvest: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'INVESTING'),
      canRaiseFunds: hasFeaturePermission(accountType, account.tier, account.isInvestor, 'RAISING_FUNDS')
    };

    next();
  } catch (error) {
    console.error('Error getting account permissions:', error);
    req.accountPermissions = {
      accountType: null,
      tier: null,
      isInvestor: false,
      canPost: false,
      canChat: false,
      canInvest: false,
      canRaiseFunds: false
    };
    next();
  }
};

// Utility function to get permission requirements for a feature
export const getFeatureRequirements = (feature, accountType = 'user') => {
  const requirements = [];
  
  if (feature === 'POSTING' || feature === 'CHATTING') {
    requirements.push(accountType === 'company' ? 'Hunter tier subscription' : 'Pro tier subscription');
  }
  
  if (feature === 'INVESTING') {
    requirements.push('Investor status');
  }
  
  if (feature === 'RAISING_FUNDS') {
    requirements.push(accountType === 'company' ? 'Hunter tier subscription' : 'Pro tier subscription');
    requirements.push('Investor status');
  }
  
  return requirements;
}; 