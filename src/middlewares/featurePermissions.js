import prisma from "../db.js";

// Feature permission configuration
const FEATURE_PERMISSIONS = {
  POSTING: {
    Standard: { 'false': false, 'true': true },  // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
    Pro: { 'false': true, 'true': true }         // { isInvestor: false, allowed: true }, { isInvestor: true, allowed: true }
  },
  CHATTING: {
    Standard: { 'false': false, 'true': true },  // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
    Pro: { 'false': true, 'true': true }         // { isInvestor: false, allowed: true }, { isInvestor: true, allowed: true }
  },
  INVESTING: {
    Standard: { 'false': false, 'true': true },  // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
    Pro: { 'false': false, 'true': true }        // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
  },
  RAISING_FUNDS: {
    Standard: { 'false': false, 'true': false }, // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: false }
    Pro: { 'false': false, 'true': false }        // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
  }
};

// Helper function to check if user has permission for a specific feature
export const hasFeaturePermission = (userTier, isInvestor, feature) => {
  const permission = FEATURE_PERMISSIONS[feature];
  if (!permission) return false;
  
  // Convert boolean to string key for lookup
  const investorKey = isInvestor ? 'true' : 'false';
  return permission[userTier]?.[investorKey] || false;
};

function getFeatureErrorMessage(feature, user) {
  if (feature === 'INVESTING') {
    if (!user.isInvestor) {
      return "Access denied. Investing is only available to users with investor status.";
    }
    if (user.tier === 'Standard') {
      return "Access denied. Investing is only available to Pro tier investors.";
    }
  }
  if (feature === 'POSTING' || feature === 'CHATTING') {
    if (user.tier === 'Standard') {
      return "Access denied. This feature requires a Pro tier subscription.";
    }
  }
  if (feature === 'RAISING_FUNDS') {
    if (user.tier === 'Standard') {
      return "Access denied. Raising funds requires a Pro tier subscription and investor status.";
    }
    if (!user.isInvestor) {
      return "Access denied. Raising funds requires investor status.";
    }
  }
  // Fallback
  return "Access denied. You do not have permission to access this feature.";
}

// Middleware to check feature permissions
export const requireFeaturePermission = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.account || !req.account.id) {
        return res.status(401).json({ 
          message: "Authentication required",
          error: "UNAUTHORIZED"
        });
      }

      // Get user details from database
      const user = await prisma.user.findUnique({
        where: { id: req.account.id },
        select: { tier: true, isInvestor: true }
      });

      if (!user) {
        return res.status(404).json({ 
          message: "User not found",
          error: "USER_NOT_FOUND"
        });
      }

      const hasPermission = hasFeaturePermission(user.tier, user.isInvestor, feature);
      
      if (!hasPermission) {
        return res.status(403).json({
          message: getFeatureErrorMessage(feature, user),
          error: "INSUFFICIENT_PERMISSIONS",
          requiredUpgrade: {
            tier: user.tier === 'Standard' ? 'Pro' : user.tier,
            isInvestor: !user.isInvestor
          }
        });
      }

      // Add user permissions to request object for use in controllers
      req.userPermissions = {
        tier: user.tier,
        isInvestor: user.isInvestor,
        canPost: hasFeaturePermission(user.tier, user.isInvestor, 'POSTING'),
        canChat: hasFeaturePermission(user.tier, user.isInvestor, 'CHATTING'),
        canInvest: hasFeaturePermission(user.tier, user.isInvestor, 'INVESTING'),
        canRaiseFunds: hasFeaturePermission(user.tier, user.isInvestor, 'RAISING_FUNDS')
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

// Middleware to get user permissions without blocking
export const getUserPermissions = async (req, res, next) => {
  try {
    if (!req.account || !req.account.id) {
      req.userPermissions = {
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false
      };
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: req.account.id },
      select: { tier: true, isInvestor: true }
    });

    if (!user) {
      req.userPermissions = {
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false
      };
      return next();
    }

    req.userPermissions = {
      tier: user.tier,
      isInvestor: user.isInvestor,
      canPost: hasFeaturePermission(user.tier, user.isInvestor, 'POSTING'),
      canChat: hasFeaturePermission(user.tier, user.isInvestor, 'CHATTING'),
      canInvest: hasFeaturePermission(user.tier, user.isInvestor, 'INVESTING'),
      canRaiseFunds: hasFeaturePermission(user.tier, user.isInvestor, 'RAISING_FUNDS')
    };

    next();
  } catch (error) {
    console.error('Error getting user permissions:', error);
    req.userPermissions = {
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
export const getFeatureRequirements = (feature) => {
  const requirements = [];
  
  if (feature === 'POSTING' || feature === 'CHATTING') {
    requirements.push('Pro tier subscription');
  }
  
  if (feature === 'INVESTING') {
    requirements.push('Investor status');
  }
  
  if (feature === 'RAISING_FUNDS') {
    requirements.push('Pro tier subscription');
    requirements.push('Investor status');
  }
  
  return requirements;
}; 