import { DayPicker } from "react-day-picker"
import type { DayPickerProps } from "react-day-picker" // import the prop types

function CustomCalendar(props: DayPickerProps) {
  return (
    <DayPicker
      components={{
        Navigation: (navProps) => (
          <div className="flex justify-between px-2">
            <button {...navProps.previousButtonProps} className="p-1">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button {...navProps.nextButtonProps} className="p-1">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ),
      }}
      {...props}
    />
  )
}
