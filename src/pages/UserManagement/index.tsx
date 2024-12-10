import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "stores/hooks";
import { UserHistoryProps } from "types/UserHistoryProps";
import { doesHaveAuthority, isAdmin, isLeader } from "utils/helpers";
import UserHistory from "./UserHistory";
import UserManagementAdmin from "./UserManagementAdmin";
import UserManagementLeader from "./UserManagementLeader";
import AdminManagementType from "./UserManagementType";
import UserManagementUser from "./UserManagementUser";

const UserManagement = () => {
  const [selectedRoles, setSelectedRoles] = useState({
    isAdmin: true,
    isLeader: false,
    isUser: false,
  });
  const [userHistory, setUserHistory] = useState<UserHistoryProps>({
    isShowing: false,
    userId: 0,
  });
  const navigate = useNavigate();
  const enqueueSnackbar = useEnqueueSnackbar();
  const user = useAppSelector((state) => state.user.user);
  const [isAutoScanUsers, setIsAutoScanUsers] = useState(false);

  useEffect(() => {
    if (!doesHaveAuthority(user)) {
      enqueueSnackbar("You don't have authority to access this page", {
        variant: "warning",
      });
      navigate("/");
    }
  }, [enqueueSnackbar, navigate, user]);

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Bot Trade</title>
      </Helmet>

      <AdminManagementType
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        isAutoScanUsers={isAutoScanUsers}
        setIsAutoScanUsers={setIsAutoScanUsers}
      />

      {!userHistory.isShowing && selectedRoles.isAdmin && isAdmin(user) && (
        <UserManagementAdmin setUserHistory={setUserHistory} />
      )}
      {!userHistory.isShowing && selectedRoles.isLeader && isLeader(user) && (
        <UserManagementLeader setUserHistory={setUserHistory} />
      )}
      {!userHistory.isShowing && selectedRoles.isUser && isLeader(user) && (
        <UserManagementUser setUserHistory={setUserHistory} />
      )}
      {userHistory.isShowing && (
        <UserHistory
          userHistory={userHistory}
          setUserHistory={setUserHistory}
        />
      )}
    </>
  );
};

export default UserManagement;
