export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dni: string
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_V1_URL;

  const requestBody = { firstName, lastName, email, password, dni };

  console.log("Cuerpo de la solicitud:", JSON.stringify(requestBody));

  const response = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();
  console.log("Respuesta de la API:", responseData);

  if (!response.ok) {
    throw new Error(
      responseData?.errors?.email ||
      responseData?.message ||
      "Error al registrar usuario."
    );
  }

  return responseData;
}
