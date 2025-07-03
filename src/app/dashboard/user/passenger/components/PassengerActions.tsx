"use client"

import { useState } from "react"
import { MoreVertical, Pencil, Eye, Trash, UserCheck, UserX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PassengerView } from "./PassengerView"
import { PassengerEdit } from "./PassengerEdit"
import { PassengerDelete } from "./PassengerDelete"
import { PassengerToggleStatus } from "./PassengerToggleStatus"
import { PassengerUserItemRS } from "../types/passenger"

interface RowActionsProps {
  rowData: PassengerUserItemRS
}

export function PassengerActions({ rowData }: RowActionsProps) {
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openToggleStatus, setOpenToggleStatus] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2">
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenView(true)}>
            <Eye className="mr-2 h-4 w-4" /> Ver
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenToggleStatus(true)}>
            {rowData.status ? (
              <>
                <UserX className="mr-2 h-4 w-4" /> Desactivar
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" /> Activar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PassengerView
        passengerId={rowData.id}
        open={openView}
        onOpenChange={setOpenView}
      />

      <PassengerEdit
        passengerId={rowData.id}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />

      <PassengerToggleStatus
        open={openToggleStatus}
        onOpenChange={setOpenToggleStatus}
        passenger={rowData}
      />

      <PassengerDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        passenger={rowData}
      />
    </>
  )
}
