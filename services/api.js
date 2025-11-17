import { env } from "../environ";

export const registrarUsuario = async (formData) => {
  try {
    const response = await fetch(`${env.api}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Error al registrar el usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
};
