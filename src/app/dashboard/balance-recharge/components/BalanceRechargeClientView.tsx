"use client"

import { useState } from "react"
import { UserSearchCard } from "./UserSearchCard"
import { UserInfoCard } from "./UserInfoCard"
import { RechargeReceipt } from "./RechargeReceipt"

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

    setSearching(true)

    setTimeout(() => {
      if (dni === "12345678") {
        const found = {
          id: "u1",
          name: "Carlos Ramirez",
          email: "carlos.ramirez@example.com",
          dni: "12345678",
          balance: 150.0,
        }
        setUser(found)
        setCurrentState("USER_FOUND")
      } else {
        setErrors((prev) => ({ ...prev, dni: "Usuario no encontrado." }))
      }
      setSearching(false)
    }, 800)
  }

  const handleRecharge = () => {
    setErrors((prev) => ({ ...prev, amount: undefined }))

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrors((prev) => ({ ...prev, amount: "Ingresa un monto válido mayor a 0." }))
      return
    }

    if (user) {
      setPreviousBalance(user.balance)
      const updatedUser = { ...user, balance: user.balance + numericAmount }
      setUser(updatedUser)
      setLastRechargeAmount(numericAmount)
      setRechargeDate(new Date())
      setAmount("")
      setCurrentState("RECHARGE_COMPLETED")
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
    <div className="max-w-2xl mx-auto space-y-6">
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
          onBack={() => setCurrentState("SEARCHING")} // <--- importante
        />
      )}


      {currentState === "RECHARGE_COMPLETED" && user && rechargeDate && (
        <RechargeReceipt  
          transactionId={"adasd-1234-5678"} 
          userName={user.name}
          userDni={user.dni}
          userEmail={user.email}
          amount={lastRechargeAmount.toFixed(2)}
          previousBalance={previousBalance} // ✅ number
          newBalance={user.balance}
          rechargeDate={rechargeDate}
          onNewRecharge={handleNewRecharge}
        />
      )}

    </div>
  )
}
