import { AdminCreateSchema } from "./adminSchema"
import { addAdmin } from "./mockAdmins"

export async function createAdmin(data: AdminCreateSchema) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = addAdmin(data)
      resolve(result)
    }, 500) 
  })
}
