export const registrarUsuario = async(formData) =>{
    try {
      const response = await fetch("https://68e8dfb5f2707e6128cc97d2.mockapi.io/api/usuario",
        {
          method:"POST",
          headers:{ 
            "Content-Type": "application/json",
          },
            body:JSON.stringify(formData),
        }
      );

      if(!response.ok){
        throw new Error("Error al registrar el usuario")
      }

      const data = await response.json()
      return data;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }
