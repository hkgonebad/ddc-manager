import React from "react"

import { Button } from "@/components/ui/button"

import DailogForm from "../DialogForm"
import CreateForm from "./CreateForm"
import "@/app/dashboard/members/styles/styles.css"

export default function CreateMember() {
  return (
    <DailogForm
      id="create-trigger"
      title="Create Member"
      Trigger={<Button variant="outline">Create+</Button>}
      form={<CreateForm />}
      isOpen={false}
      onOpen={() => {}}
    />
  )
}
