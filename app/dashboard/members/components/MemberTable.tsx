import React from "react"

import Table from "@/components/ui/Table"

import ListOfMembers from "./ListOfMembers"

export default function MemberTable() {
  const tableHeader = ["Name", "Role", "Joined", "Status"]

  return (
    <Table headers={tableHeader}>
      <ListOfMembers />
    </Table>
  )
}
