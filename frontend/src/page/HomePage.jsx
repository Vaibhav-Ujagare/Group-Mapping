import { useEffect } from "react";
import GroupList from "../components/GroupList";
import { useGroupStore } from "../store/useGroupStore";

const HomePage = () => {
  const { groupList, allGroups } = useGroupStore();

  useEffect(() => {
    groupList();
  }, [groupList]);

  return (
    <div className="p-5 space-y-5">
      <div className="min-h-screen flex ">
        {allGroups.length >= 0 ? (
          <GroupList groups={allGroups} />
        ) : (
          <div className="min-h-fit min-w-full border flex items-center place-content-center bg-gray-900 px-4 py-4">
            {/* Card */}
            <h2>No Groups Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
