"use client"

import { useState } from "react"
import { MoreVertical, Pencil, Eye, Trash, UserCheck, UserX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DriverListItem } from "@/types/driver"
import { DriverDelete } from "./DriverDelete"
import { DriverEditClient } from "../client/DriverEditClient"
import { DriverViewClient } from "../client/DriverViewClient"
import { DriverToggleStatus } from "./DriverToggleStatus"

interface RowActionsProps {
  rowData: DriverListItem
}

export function DriverActions({ rowData }: RowActionsProps) {
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openToggleStatus, setOpenToggleStatus] = useState(false);

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

      <DriverViewClient open={openView} onOpenChange={setOpenView} driverId={rowData.id} />
      <DriverEditClient
        open={openEdit}
        onOpenChange={setOpenEdit}
        driverId={rowData.id}
      />
      <DriverToggleStatus open={openToggleStatus} onOpenChange={setOpenToggleStatus} driver={rowData} />
      <DriverDelete open={openDelete} onOpenChange={setOpenDelete} driver={rowData} />
    </>
  )
}
