export default function DashboardLoading() {
  return (
    <div className=\"flex items-center justify-center min-h-[60vh]\">
      <div className=\"flex flex-col items-center gap-3\">
        <div className=\"w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin\" />
        <p className=\"text-sm text-gray-500 font-medium\">Dang tai...</p>
      </div>
    </div>
  );
}