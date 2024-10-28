import MemberTable from "./components/MemberTable"
import SearchMembers from "./components/SearchMembers"
import CreateMember from "./components/create/CreateMember"

export default function Members() {
  return (
    <div className="w-full space-y-5 overflow-y-auto px-3">
      <h1 className="text-3xl font-bold">Members</h1>
      <div className="flex gap-2">
        <SearchMembers />
        <CreateMember />
      </div>
      <MemberTable />
    </div>
  )
}
