import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card.js";
import { Button } from "./Button.js";
import { Badge } from "./Badge.js";
import { useUnifiedPermissions } from "../../_hooks/useUnifiedPermissions.js";

export function UpgradePrompt({ feature, onUpgrade, onClose }) {
  const { getUpgradeRequirements, getAccountTypeLabel, getTierLabel, permissions } = useUnifiedPermissions();
  const requirements = getUpgradeRequirements(feature);
  const accountType = getAccountTypeLabel().toLowerCase();
  
  const getFeatureTitle = (feature) => {
    switch (feature) {
      case 'POSTING':
        return 'Create Posts';
      case 'CHATTING':
        return 'Send Messages';
      case 'INVESTING':
        return 'Make Investments';
      case 'RAISING_FUNDS':
        return 'Raise Funds';
      default:
        return 'This Feature';
    }
  };

  const getFeatureDescription = (feature) => {
    switch (feature) {
      case 'POSTING':
        return accountType === "company" 
          ? 'Share your company updates, events, and announcements with the community'
          : 'Share your ideas, events, and updates with the community';
      case 'CHATTING':
        return accountType === "company"
          ? 'Connect with other companies and members through direct messaging'
          : 'Connect with other members through direct messaging';
      case 'INVESTING':
        return accountType === "company"
          ? 'Invest in promising startups and opportunities as a company'
          : 'Invest in promising startups and opportunities';
      case 'RAISING_FUNDS':
        return accountType === "company"
          ? 'Raise capital for your company or project'
          : 'Raise capital for your startup or project';
      default:
        return 'Access this premium feature';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <CardTitle className="text-xl font-semibold">
          {getFeatureTitle(feature)}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {getFeatureDescription(feature)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {requirement}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-1">Benefits:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Access to premium features</li>
            <li>• Connect with investors and founders</li>
            <li>• Grow your network</li>
            <li>• Exclusive opportunities</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={onUpgrade} 
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {accountType === "company" ? "Upgrade to Hunter" : "Upgrade to Pro"}
          </Button>
          {onClose && (
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1"
            >
              Maybe Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function FeatureGuard({ feature, children, fallback }) {
    const { checkPermission, loading } = useUnifiedPermissions();
    
    // Show loading state while permissions are being fetched
    if (loading) {
      return <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>;
    }
    
    const canAccess = checkPermission(feature);
    if (!canAccess) {
      return fallback || <UpgradePrompt feature={feature} />;
    }
    return children;
  }