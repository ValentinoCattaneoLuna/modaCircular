const formulario = document.getElementById("testimonioForm");



export async function sendTestimonio() {

    addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(formulario);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch("http://localhost:4000/api/testimonios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            Swal.fire({
                title: "Gracias",
                text: "Por tu colaboracion!",
                icon: "success"
            });
            formulario.reset()
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lo sentimos",
                text: "Ocurrio un error inesperado!",
            });
        }
    });

}