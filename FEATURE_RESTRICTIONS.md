# Feature Restriction System

This document outlines the comprehensive feature restriction system implemented to limit website features based on user tier and investor status.

## Overview

The system restricts access to four main features:
- **Posting**: Create posts, events, polls, etc.
- **Chatting**: Send messages and create chats
- **Investing**: Make investments in fundraising campaigns
- **Raising Funds**: Create and manage fundraising campaigns

## Permission Matrix

| User Type | Tier | isInvestor | Can Post | Can Chat | Can Invest | Can Raise Funds |
|-----------|------|------------|----------|----------|------------|-----------------|
| Standard User | Standard | false | ❌ | ❌ | ❌ | ❌ |
| Standard User | Standard | true | ✅ | ✅ | ✅ | ❌ |
| Standard User | Pro | false | ✅ | ✅ | ❌ | ❌ |
| Standard User | Pro | true | ✅ | ✅ | ✅ | ✅ |

## Implementation Details

### Backend Implementation

#### 1. Feature Permissions Middleware (`src/middlewares/featurePermissions.js`)

- **`hasFeaturePermission(userTier, isInvestor, feature)`**: Helper function to check permissions
- **`requireFeaturePermission(feature)`**: Middleware that blocks API access
- **`getUserPermissions()`**: Middleware that adds permissions to request object without blocking

#### 2. API Endpoints Protected

**Posting Routes:**
- `POST /api/createType1Post` - Funding posts
- `POST /api/createType2Post` - Partner posts
- `POST /api/createType3Post` - Guidance posts
- `POST /api/createType4Post` - Event posts
- `POST /api/createType5Post` - Poll posts
- `POST /api/createType6Post` - Document posts

**Investing Routes:**
- `POST /api/investments/fixedPrice` - Fixed price investments
- `POST /api/investments/negotiatePrice` - Negotiated investments
- `POST /api/investments/cancel` - Cancel investments
- `POST /api/investments/offer/cancel` - Cancel investment offers

**Fundraising Routes:**
- `POST /api/raisingFunds/offer/accept` - Accept investment offers
- `POST /api/raisingFunds/offer/reject` - Reject investment offers
- `POST /api/raisingFunds/cancel` - Cancel fundraising campaigns

**Chat Socket Events:**
- `create chat` - Creating new chats
- `send message` - Sending messages

#### 3. User Permissions API

- **`GET /api/getUserPermissions`**: Returns user's current permissions

### Frontend Implementation

#### 1. Permissions Hook (`app/_hooks/usePermissions.js`)

```javascript
const { canPost, canChat, canInvest, canRaiseFunds, loading, error } = usePermissions();
```

#### 2. Feature Guard Component (`app/_components/_ui/UpgradePrompt.js`)

```javascript
<FeatureGuard feature="POSTING" permissions={{ canPost }}>
  <PostingComponent />
</FeatureGuard>
```

#### 3. Upgrade Prompt Component

Shows when users don't have permission, with:
- Feature-specific requirements
- Upgrade call-to-action
- Benefits explanation

## Usage Examples

### Backend - Adding Permission Check

```javascript
import { requireFeaturePermission } from './middlewares/featurePermissions.js';

// Protect a route
router.post('/myProtectedRoute', requireFeaturePermission('POSTING'), myController);
```

### Frontend - Using Permissions Hook

```javascript
import { usePermissions } from '@/app/_hooks/usePermissions.js';

function MyComponent() {
  const { canPost, loading } = usePermissions();
  
  if (loading) return <LoadingSpinner />;
  
  return canPost ? <PostForm /> : <UpgradePrompt feature="POSTING" />;
}
```

### Frontend - Using Feature Guard

```javascript
import { FeatureGuard } from '@/app/_components/_ui/UpgradePrompt.js';

function MyPage() {
  const { canPost } = usePermissions();
  
  return (
    <FeatureGuard feature="POSTING" permissions={{ canPost }}>
      <PostingInterface />
    </FeatureGuard>
  );
}
```

## Error Handling

### API Error Responses

When permission is denied, APIs return:

```json
{
  "message": "Access denied. This feature requires Pro tier or investor status or higher.",
  "error": "INSUFFICIENT_PERMISSIONS",
  "requiredUpgrade": {
    "tier": "Pro",
    "isInvestor": true
  }
}
```

### Frontend Error Handling

The `usePermissions` hook handles:
- Loading states
- Error states
- Permission refresh functionality

## Database Schema

The system relies on the existing User model with:
- `tier`: Enum ('Standard', 'Pro')
- `isInvestor`: Boolean

## Security Considerations

1. **Server-side validation**: All permission checks happen on the backend
2. **Socket.io protection**: Chat permissions checked on socket events
3. **Middleware chain**: Permissions checked before controller execution
4. **Graceful degradation**: Frontend shows appropriate upgrade prompts

## Testing

### Manual Testing Checklist

- [ ] Standard user (non-investor) cannot post
- [ ] Standard user (non-investor) cannot chat
- [ ] Standard user (non-investor) cannot invest
- [ ] Standard user (non-investor) cannot raise funds
- [ ] Standard user (investor) can post and chat
- [ ] Standard user (investor) can invest but not raise funds
- [ ] Pro user (non-investor) can post and chat
- [ ] Pro user (non-investor) cannot invest or raise funds
- [ ] Pro user (investor) can access all features

### API Testing

Test each protected endpoint with different user types and verify:
- Correct 403 responses for unauthorized users
- Correct 200 responses for authorized users
- Proper error messages and upgrade information

## Future Enhancements

1. **Role-based permissions**: Add more granular role system
2. **Temporary permissions**: Time-limited feature access
3. **Usage limits**: Track and limit feature usage
4. **Admin overrides**: Allow admins to grant temporary access
5. **Analytics**: Track permission denials and upgrade conversions

## Troubleshooting

### Common Issues

1. **Permission not updating**: Call `refreshPermissions()` after user tier changes
2. **Socket connection issues**: Ensure chat permissions are checked on connection
3. **API 403 errors**: Verify user tier and investor status in database
4. **Frontend not showing upgrade prompt**: Check if `usePermissions` hook is properly imported

### Debug Mode

Enable debug logging by setting:
```javascript
console.log('User permissions:', permissions);
console.log('Feature access check:', canAccessFeature(permissions, 'POSTING'));
``` 