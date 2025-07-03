"use client"

import { useState } from "react"
import { UserSearchCard } from "./UserSearchCard"
import { UserInfoCard } from "./UserInfoCard"
import { RechargeReceipt } from "./RechargeReceipt"

import { getPassengerByDni, rechargePassengerBalance } from "../lib/api"

export interface UserData {
  id: string
  name: string
  email: string
  dni: string
  balance: number
}

export default function BalanceRechargeClientView() {
  const [dni, setDni] = useState("")
  const [user, setUser] = useState<UserData | null>(null)
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<{ dni?: string; amount?: string }>({})
  const [searching, setSearching] = useState(false)
  const [currentState, setCurrentState] = useState<"SEARCHING" | "USER_FOUND" | "RECHARGE_COMPLETED">("SEARCHING")
  const [lastRechargeAmount, setLastRechargeAmount] = useState(0)
  const [previousBalance, setPreviousBalance] = useState(0)
  const [rechargeDate, setRechargeDate] = useState<Date | null>(null)

  const handleSearch = async () => {
    setErrors({})
    setUser(null)

    if (!dni.trim()) {
      setErrors((prev) => ({ ...prev, dni: "Debes ingresar un DNI." }))
      return
    }

    if (!/^\d{8}$/.test(dni)) {
      setErrors((prev) => ({ ...prev, dni: "El DNI debe tener 8 dígitos." }));
      return;
    }

    setSearching(true)
    try {
      const response = await getPassengerByDni(dni);
      const passenger = response.data;

      if (!passenger) {
        console.warn("Respuesta sin datos: ", response);
        setErrors((prev) => ({ ...prev, dni: "Usuario no encontrado o inválido." }));
        return;
      }

      setUser({
        id: String(passenger.id),
        name: `${passenger.firstName} ${passenger.lastName}`,
        email: passenger.email,
        dni: passenger.dni,
        balance: passenger.balance,
      });

      setCurrentState("USER_FOUND");
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        errors?: { error?: string };
      };

      const message = err?.errors?.error || err?.message || "Ocurrió un error al buscar el pasajero.";

      setErrors((prev) => ({ ...prev, dni: message }));
      console.error("❌ Error detallado:", error);
    } finally {
      setSearching(false);
    }
  }

  const handleRecharge = async () => {
    setErrors((prev) => ({ ...prev, amount: undefined }))

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrors((prev) => ({ ...prev, amount: "Ingresa un monto válido mayor a 0." }))
      return
    }
    if (!user) return;
    try {
      // Llama al backend para hacer la recarga
      const response = await rechargePassengerBalance(Number(user.id), {
        amount: numericAmount,
        description: "Recarga realizada en sucursal"
      });

      // Extrae datos de la transacción retornada
      const transaction = response.data;

      if (!transaction) {
        throw new Error("No se recibió la información de la transacción.");
      }

      // Actualiza el estado con los datos nuevos
      setPreviousBalance(user.balance);
      const updatedUser = { ...user, balance: transaction.amount + user.balance };
      setUser(updatedUser);
      setLastRechargeAmount(transaction.amount);
      setRechargeDate(new Date(transaction.transactionDate));
      setAmount("");
      setCurrentState("RECHARGE_COMPLETED");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error al recargar saldo:", error.message);
        setErrors((prev) => ({ ...prev, amount: error.message }));
      } else {
        console.error("❌ Error inesperado:", error);
        setErrors((prev) => ({ ...prev, amount: "Error inesperado al recargar saldo." }));
      }
    }
  }

  const handleNewRecharge = () => {
    setDni("")
    setUser(null)
    setAmount("")
    setErrors({})
    setLastRechargeAmount(0)
    setRechargeDate(null)
    setCurrentState("SEARCHING")
  }

  const getEstimatedBalance = () => {
    const parsed = parseFloat(amount)
    return isNaN(parsed) ? null : `S/ ${(user!.balance + parsed).toFixed(2)}`
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 mt-8">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {currentState === "SEARCHING" && (
            <UserSearchCard
              dni={dni}
              onChange={setDni}
              onSearch={handleSearch}
              isSearching={searching}
              error={errors.dni}
            />
          )}

          {currentState === "USER_FOUND" && user && (
            <UserInfoCard
              user={user}
              amount={amount}
              onAmountChange={setAmount}
              onRecharge={handleRecharge}
              error={errors.amount}
              estimatedBalance={getEstimatedBalance()}
              isRechargeDisabled={!amount || !!errors.amount}
              onBack={() => setCurrentState("SEARCHING")}
            />
          )}

          {currentState === "RECHARGE_COMPLETED" && user && rechargeDate && (
            <RechargeReceipt
              transactionId={"adasd-1234-5678"}
              userName={user.name}
              userDni={user.dni}
              userEmail={user.email}
              amount={lastRechargeAmount.toFixed(2)}
              previousBalance={previousBalance}
              newBalance={user.balance}
              rechargeDate={rechargeDate}
              onNewRecharge={handleNewRecharge}
            />
          )}
        </div>
      </div>
    </div>
  )
}
