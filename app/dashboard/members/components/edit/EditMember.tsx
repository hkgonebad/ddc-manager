import React from "react"
import { Pencil1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

import DailogForm from "../DialogForm"
import EditForm from "./EditForm"

export default function EditMember() {
  return (
    <DailogForm
      id="update-trigger"
      title="Edit Member"
      Trigger={
        <Button variant="outline">
          <Pencil1Icon />
        </Button>
      }
      form={<EditForm />}
    />
  )
}
