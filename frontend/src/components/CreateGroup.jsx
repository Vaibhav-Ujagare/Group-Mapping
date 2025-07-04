import { useForm } from "react-hook-form";

const CreateGroup = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 space-y-5">
      <div className="items-end  w-full ">
        {
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Create New Group</h3>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="label">Group Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    required
                    {...register("name", {
                      required: "Group name is required",
                    })}
                  />
                  {errors.group_name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.group_name.message}
                      </span>
                    </label>
                  )}
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    required
                    {...register("description")}
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Create
                  </button>
                  <button type="button" onClick={onClose} className="btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        }
      </div>
    </div>
  );
};

export default CreateGroup;
