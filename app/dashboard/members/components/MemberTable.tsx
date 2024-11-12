import React from "react"

import Table from "@/app/dashboard/members/components/Table"

import ListOfMembers from "./ListOfMembers"

export default function MemberTable() {
  const tableHeader = ["Name", "Role", "Joined", "Status"]

  return (
    <Table headers={tableHeader}>
      <ListOfMembers />
    </Table>
  )
}
