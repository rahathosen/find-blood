import DonorsList from "@/components/DonorsList";

export default function DonorsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <DonorsList
              searchParams={{
                query: "",
                bloodGroup: "",
                minAge: "",
                maxAge: "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
