import { useEffect } from "react";
import GroupList from "../components/GroupList";
import { useGroupStore } from "../store/useGroupStore";
import { Users, User, ArrowDown } from "lucide-react";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import UserList from "../components/UserList";

const HomePage = () => {
  const { groupList, allGroups } = useGroupStore();

  useEffect(() => {
    groupList();
  }, [groupList]);

  return (
    <div className="min-h-screen p-5 space-y-5">
      {/* name of each tab group should be unique */}
      <div>
        <div className="tabs tabs-lift ">
          <label className="tab space-x-2.5 ">
            <input type="radio" name="my_tabs_4" defaultChecked />
            <Users />
            <div>Groups</div>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className=" min=h-screen flex ">
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

          <label className="tab space-x-2.5 ">
            <input type="radio" name="my_tabs_4" />
            <User />

            <div>Users</div>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
