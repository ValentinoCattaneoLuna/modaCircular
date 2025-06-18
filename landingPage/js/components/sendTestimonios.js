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

        const result = await response.json();
        console.log("Success:", result);
        //alert("Testimonio enviado con éxito"); //implementar un sweetalert de éxito
    } catch (error) {
        console.error("Error:", error);
        //alert("Error al enviar el testimonio"); //implementar un sweetalert de error
    }
});

}