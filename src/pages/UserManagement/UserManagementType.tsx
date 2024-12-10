import CustomToggle from "components/CustomToggle";
import React, { FC } from "react";
import { useAppSelector } from "stores/hooks";
import { isAdmin, isLeader } from "utils/helpers";

type Roles = {
  isAdmin: boolean;
  isLeader: boolean;
  isUser: boolean;
};

const DEFAULT_ROLES: Roles = {
  isAdmin: false,
  isLeader: false,
  isUser: false,
};

type UserManagementTypeProps = {
  selectedRoles: Roles;
  setSelectedRoles: React.Dispatch<React.SetStateAction<Roles>>;
  isAutoScanUsers: boolean;
  setIsAutoScanUsers: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserManagementType: FC<UserManagementTypeProps> = ({
  selectedRoles,
  setSelectedRoles,
  isAutoScanUsers,
  setIsAutoScanUsers,
}) => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
      {/* OPTIONS */}
      <div className={`flex items-center gap-4`}>
        {isAdmin(user) && (
          <div
            className={`rounded-xl px-6 py-3 cursor-pointer ${
              selectedRoles.isAdmin
                ? "border-primary bg-primary-10"
                : "bg-primary-05"
            } whitespace-nowrap`}
            onClick={() => {
              setSelectedRoles((prev) => ({
                ...DEFAULT_ROLES,
                isAdmin: true,
              }));
            }}
          >
            <p
              className={`${
                selectedRoles.isAdmin
                  ? "bg-primary-100 bg-clip-text text-transparent font-semibold"
                  : "text-ink-60 font-medium"
              }`}
            >
              Admin
            </p>
          </div>
        )}
        {isLeader(user) && (
          <div
            className={`px-6 py-3 rounded-xl cursor-pointer ${
              selectedRoles.isLeader
                ? "border-primary bg-primary-10"
                : "bg-primary-05"
            } whitespace-nowrap`}
            onClick={() => {
              setSelectedRoles((prev) => ({
                ...DEFAULT_ROLES,
                isLeader: true,
              }));
            }}
          >
            <p
              className={`${
                selectedRoles.isLeader
                  ? "bg-primary-100 bg-clip-text text-transparent font-semibold"
                  : "text-ink-60 font-medium"
              }`}
            >
              Leader
            </p>
          </div>
        )}
        <div
          className={`px-6 py-3 rounded-xl cursor-pointer ${
            selectedRoles.isUser
              ? "border-primary bg-primary-10"
              : "bg-primary-05"
          } whitespace-nowrap`}
          onClick={() => {
            setSelectedRoles((prev) => ({
              ...DEFAULT_ROLES,
              isUser: true,
            }));
          }}
        >
          <p
            className={`${
              selectedRoles.isUser
                ? "bg-primary-100 bg-clip-text text-transparent font-semibold"
                : "text-ink-60 font-medium"
            }`}
          >
            User
          </p>
        </div>
      </div>

      {/* SWITCH */}
      <CustomToggle
        content="Tự động quét thành viên"
        checked={isAutoScanUsers}
        onChange={() => {
          setIsAutoScanUsers((prev) => !prev);
        }}
      />
    </div>
  );
};

export default UserManagementType;
