import { Button } from "@/components/ui/button"

interface EditButtonsProps {
  onCancel: () => void
}

export function EditButtons({ onCancel }: EditButtonsProps) {
  return (
    <div className="flex gap-2 w-full">
      <Button variant="secondary" onClick={onCancel} className="w-full">
        Cancelar
      </Button>
    </div>
  )
}
