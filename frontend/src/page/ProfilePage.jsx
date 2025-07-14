import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import { useGroupStore } from "../store/useGroupStore";
import StatsCard from "../components/StatsCard";

const ProfilePage = () => {
  const { getUserProfile, userProfile, userRole } = useAuthStore();
  const { adminRole } = useAdminAuthStore();

  if (userRole) {
    useEffect(() => {
      getUserProfile();
    }, [getUserProfile]);
  }

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-4 mt-4">
        {adminRole == "ADMIN"
          ? `${adminRole.toUpperCase()} Profile`
          : `Student Profile`}
      </h2>
      <div className="max-w-full h-[80vh] mx-auto p-4 space-y-4 bg-base-200 rounded-md shadow-md mt-6 mb-6">
        {adminRole == "ADMIN" ? (
          <div className="h-[50vh] bg-base-200">
            {/* {JSON.stringify(allGroups)} */}
            <StatsCard />
            {/* <StatsCard
              userCount={allUsers.length}
              groupCount={allGroups.length}
            /> */}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(userProfile)
              .filter(
                ([key]) =>
                  ![
                    "password",
                    "accessToken",
                    "refreshToken",
                    "forgotPasswordToken",
                    "forgotPasswordTokenExpiry",
                  ].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="font-semibold capitalize">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="text-right">
                    {value === null ? "N/A" : value.toString()}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
