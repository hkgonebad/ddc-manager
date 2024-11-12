"use client"

import React, { ReactNode, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DailogForm({
  Trigger,
  id,
  title,
  form,
  isOpen,
  onOpen,
}: {
  title: string
  Trigger: ReactNode
  id: string
  form: ReactNode
  isOpen: boolean
  onOpen: (open: boolean) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpen}>
      <DialogTrigger asChild id={id}>
        {Trigger}
      </DialogTrigger>
      <DialogContent className="dark:bg-gradient-dark my-5 sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}
