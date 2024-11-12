"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarDateRangePickerProps {
  onSelect: (dateRange: DateRange | undefined) => void
  defaultDateRange?: DateRange
}

export function CalendarDateRangePicker({
  onSelect,
  defaultDateRange,
}: CalendarDateRangePickerProps) {
  // const today = new Date() // Get today's date
  // const initialDateRange: DateRange = { from: today, to: today } // Default to today

  // const [date, setDate] = React.useState<DateRange | undefined>(
  //   initialDateRange
  // )

  const [date, setDate] = React.useState<DateRange | undefined>(
    defaultDateRange
  )

  React.useEffect(() => {
    onSelect(date)
  }, [date, onSelect])

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range)
              onSelect(range)
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
