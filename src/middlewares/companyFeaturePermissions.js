import prisma from "../db.js";

// Company feature permission configuration
const COMPANY_FEATURE_PERMISSIONS = {
  POSTING: {
    Holder: { 'false': false, 'true': true },  // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
    Hunter: { 'false': true, 'true': true }     // { isInvestor: false, allowed: true }, { isInvestor: true, allowed: true }
  },
  CHATTING: {
    Holder: { 'false': false, 'true': true },  // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
    Hunter: { 'false': true, 'true': true }     // { isInvestor: false, allowed: true }, { isInvestor: true, allowed: true }
  },
  INVESTING: {
    Holder: { 'false': false, 'true': true },  // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
    Hunter: { 'false': false, 'true': true }    // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
  },
  RAISING_FUNDS: {
    Holder: { 'false': false, 'true': false }, // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: false }
    Hunter: { 'false': false, 'true': true }    // { isInvestor: false, allowed: false }, { isInvestor: true, allowed: true }
  }
};

// Helper function to check if company has permission for a specific feature
export const hasCompanyFeaturePermission = (companyTier, isInvestor, feature) => {
  const permission = COMPANY_FEATURE_PERMISSIONS[feature];
  if (!permission) return false;
  
  // Convert boolean to string key for lookup
  const investorKey = isInvestor ? 'true' : 'false';
  return permission[companyTier]?.[investorKey] || false;
};

function getCompanyFeatureErrorMessage(feature, company) {
  if (feature === 'INVESTING') {
    if (!company.isInvestor) {
      return "Access denied. Investing is only available to companies with investor status.";
    }
    if (company.tier === 'Holder') {
      return "Access denied. Investing is only available to Hunter tier companies.";
    }
  }
  if (feature === 'POSTING' || feature === 'CHATTING') {
    if (company.tier === 'Holder') {
      return "Access denied. This feature requires a Hunter tier subscription.";
    }
  }
  if (feature === 'RAISING_FUNDS') {
    if (company.tier === 'Holder') {
      return "Access denied. Raising funds requires a Hunter tier subscription and investor status.";
    }
    if (!company.isInvestor) {
      return "Access denied. Raising funds requires investor status.";
    }
  }
  // Fallback
  return "Access denied. You do not have permission to access this feature.";
}

// Middleware to check company feature permissions
export const requireCompanyFeaturePermission = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.account || !req.account.id) {
        return res.status(401).json({ 
          message: "Authentication required",
          error: "UNAUTHORIZED"
        });
      }

      // Get company details from database
      const company = await prisma.company.findUnique({
        where: { id: req.account.id },
        select: { tier: true, isInvestor: true }
      });

      if (!company) {
        return res.status(404).json({ 
          message: "Company not found",
          error: "COMPANY_NOT_FOUND"
        });
      }

      const hasPermission = hasCompanyFeaturePermission(company.tier, company.isInvestor, feature);
      
      if (!hasPermission) {
        return res.status(403).json({
          message: getCompanyFeatureErrorMessage(feature, company),
          error: "INSUFFICIENT_PERMISSIONS",
          requiredUpgrade: {
            tier: company.tier === 'Holder' ? 'Hunter' : company.tier,
            isInvestor: !company.isInvestor
          }
        });
      }

      // Add company permissions to request object for use in controllers
      req.companyPermissions = {
        tier: company.tier,
        isInvestor: company.isInvestor,
        canPost: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'POSTING'),
        canChat: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'CHATTING'),
        canInvest: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'INVESTING'),
        canRaiseFunds: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'RAISING_FUNDS')
      };

      next();
    } catch (error) {
      console.error('Error checking company feature permissions:', error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: "PERMISSION_CHECK_FAILED"
      });
    }
  };
};

// Middleware to get company permissions without blocking
export const getCompanyPermissions = async (req, res, next) => {
  try {
    if (!req.account || !req.account.id) {
      req.companyPermissions = {
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false
      };
      return next();
    }

    const company = await prisma.company.findUnique({
      where: { id: req.account.id },
      select: { tier: true, isInvestor: true }
    });

    if (!company) {
      req.companyPermissions = {
        tier: null,
        isInvestor: false,
        canPost: false,
        canChat: false,
        canInvest: false,
        canRaiseFunds: false
      };
      return next();
    }

    req.companyPermissions = {
      tier: company.tier,
      isInvestor: company.isInvestor,
      canPost: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'POSTING'),
      canChat: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'CHATTING'),
      canInvest: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'INVESTING'),
      canRaiseFunds: hasCompanyFeaturePermission(company.tier, company.isInvestor, 'RAISING_FUNDS')
    };

    next();
  } catch (error) {
    console.error('Error getting company permissions:', error);
    req.companyPermissions = {
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
export const getCompanyFeatureRequirements = (feature) => {
  const requirements = [];
  
  if (feature === 'POSTING' || feature === 'CHATTING') {
    requirements.push('Hunter tier subscription');
  }
  
  if (feature === 'INVESTING') {
    requirements.push('Investor status');
  }
  
  if (feature === 'RAISING_FUNDS') {
    requirements.push('Hunter tier subscription');
    requirements.push('Investor status');
  }
  
  return requirements;
}; 