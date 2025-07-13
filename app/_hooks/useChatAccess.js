import { useUnifiedPermissions } from "@/app/_hooks/useUnifiedPermissions";
import { useEffect, useState } from "react";
import axios from "axios";

// export function useChatAccess(userId) {
//   const { canChat, loading: permLoading, error } = usePermissions();
//   const [isParticipant, setIsParticipant] = useState(false);
//   const [loading, setLoading] = useState(true); // Start as true
//   const [canAccessChat, setCanAccessChat] = useState(false); // Start as false

//   useEffect(() => {
//     let cancelled = false;
//     async function check() {
//       if (permLoading) {
//         setLoading(true);
//         return;
//       }
//       if (canChat) {
//         if (!cancelled) {
//           setCanAccessChat(true);
//           setLoading(false);
//         }
//         return;
//       }
//       if (!userId) {
//         if (!cancelled) {
//           setCanAccessChat(false);
//           setLoading(false);
//         }
//         return;
//       }
//       try {
//         const res = await axios.get(`/api/userHasChats?userId=${userId}`);
//         if (!cancelled) {
//           setIsParticipant(res.data.hasChats);
//           setCanAccessChat(res.data.hasChats);
//           setLoading(false);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setIsParticipant(false);
//           setCanAccessChat(false);
//           setLoading(false);
//         }
//       }
//     }
//     check();
//     return () => {
//       cancelled = true;
//     };
//   }, [canChat, permLoading, userId]);

//   return { canAccessChat, loading, error };
// } 

export function useChatAccess(userId) {
  	const { checkPermission, loading, error } = useUnifiedPermissions();
	const canChat = checkPermission('CHATTING');
  const [isParticipant, setIsParticipant] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (canChat || loading || !userId) {
      setChecking(false);
      return;
    }
    // Only check if canChat is false
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER}/api/userHasChats`, {
        params: { userId },
        withCredentials: true,
      })
      .then((res) => {
        setIsParticipant(res.data.hasChats);
        setChecking(false);
      })
      .catch(() => {
        setIsParticipant(false);
        setChecking(false);
      });
  }, [canChat, loading, userId]);

  return {
    canAccessChat: canChat || isParticipant,
    canCreateChat: canChat, // Only true for those with permission
    loading: loading || checking,
    error,
  };
}