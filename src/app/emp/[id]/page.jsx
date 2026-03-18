import { getEmployeeById } from '../service'
import EmployeeDetails from '../components/EmployeeDetails'

export default async function EmployeeViewPage({ params }) {
  const { id } = await params;
  const raw = await getEmployeeById(id);
  const record = { ...raw, dOB: new Date().toString() }

  return (
    <div className="p-6 flex justify-center">
      <EmployeeDetails record={record} id={id} />
    </div>
  )
}
