import Filters from "./Filters";

export default async function Page({ searchParams }) {
  const  values = await searchParams;
  const selected =  values?.filter?.split(",") || [];

  return (
    <div className="p-6 space-y-6">
      <Filters selected={selected} />
      <pre>
        {JSON.stringify(values, null, 2)}
      </pre>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Selected:</h2>
        <pre className="bg-gray-100 p-3 rounded">
          {JSON.stringify(selected, null, 2)}
        </pre>
      </div>
    </div>
  );
}