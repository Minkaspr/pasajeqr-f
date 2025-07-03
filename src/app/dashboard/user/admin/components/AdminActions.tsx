"use client"

import { useState } from "react"
import { MoreVertical, Pencil, Eye, Trash, UserCheck, UserX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AdminView } from "./AdminView"
import { AdminEdit } from "./AdminEdit"
import { AdminDelete } from "./AdminDelete"
import { AdminToggleStatus } from "./AdminToggleStatus"
import { AdminUserItemRS } from "../types/admin"

interface RowActionsProps {
  rowData: AdminUserItemRS
}

export function AdminActions({ rowData }: RowActionsProps) {
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

      <AdminView
        adminId={rowData.id}
        open={openView}
        onOpenChange={setOpenView}
      />

      <AdminEdit
        adminId={rowData.id}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />

      <AdminToggleStatus open={openToggleStatus} onOpenChange={setOpenToggleStatus} admin={rowData} />
      <AdminDelete open={openDelete} onOpenChange={setOpenDelete} admin={rowData} />
    </>
  )
}
