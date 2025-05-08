export async function registerUser(nombre: string, email: string, password: string, dni: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Crear el cuerpo de la solicitud (lo que estamos enviando)
  const requestBody = { nombre, email, password, dni };
  
  // Imprimir el JSON que se enviará
  console.log("Cuerpo de la solicitud:", JSON.stringify(requestBody));

  const response = await fetch(`${apiUrl}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();
  console.log("Respuesta de la API:", responseData);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al registrar usuario.");
  }

  return response.json();
}
