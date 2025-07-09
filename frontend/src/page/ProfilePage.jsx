import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { getUserProfile, userProfile, isFetchingProfile } = useAuthStore();

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  return (
    <div className="max-w-xl h-[80vh] mx-auto p-4 space-y-4 bg-base-200 rounded-md shadow-md mt-6 mb-6">
      <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
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
    </div>
  );
};

export default ProfilePage;
