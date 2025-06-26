import { PassengerCreateSchema } from "./passengerSchema"
import { addPassenger } from "./mockPassengers"

export async function createPassenger(data: PassengerCreateSchema) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = addPassenger(data)
      resolve(result)
    }, 500)
  })
}
