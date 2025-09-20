import { ClipLoader } from "react-spinners";

export default function Loader({ loading = true, size = 50 }) {
  return (
    <div className="flex justify-center items-center h-64">
      <ClipLoader color="#10B981" loading={loading} size={size} />
    </div>
  );
}
