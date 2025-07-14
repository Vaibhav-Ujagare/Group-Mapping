import { useEffect } from "react";
import CsvUploader from "../components/CsvUploader";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import UserList from "../components/UserList";

const AdminHomePage = () => {
  const { csvData, showCSVData } = useAdminAuthStore();

  useEffect(() => {
    showCSVData();
  }, [showCSVData]);

  return (
    <div className="min-h-screen p-6 ">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Admin Dashboard
      </h1>

      {/* Other Admin content here... */}

      {/* CSV Upload Section */}
      <div className="">
        <div className="basis-1/2 min-h-[20rem]">
          <CsvUploader />
        </div>

        {/* <UserList /> */}
        <div className=" px-2  basis-1/2">
          {csvData.length > 0 ? (
            <div className="collapse bg-base-100 border border-white-base-300 mt-4">
              <input type="checkbox" className="peer" checked />
              <div className="collapse-title font-semibold peer-checked:bg-base-200 flex place-content-between">
                Cohort CSV DATA
              </div>
              <div className="collapse-content overflow-auto">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Cohort Name</th>
                        <th>Role</th>
                        <th>Can Create Group</th>
                        <th>Is Group Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.map((row, index) => (
                        <tr key={row.id}>
                          <td>{index + 1}</td>
                          <td>{row.email}</td>
                          <td>{row.cohort_name}</td>
                          <td>{row.role}</td>
                          <td>{row.canCreateGroup ? "Yes" : "No"}</td>
                          <td>{row.isGroupJoined ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col mt-5">
              <div className="card bg-base-300 rounded-box grid h-20 place-items-center">
                NO DATA TO SHOW
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
