/**
 * Contiene los archivos del Frontend (elementos que se ejecutan
 * en el contexto del navegador)
 */
window.showModal = (message) => {
  document.getElementById("modal-message").innerText = message;
  document.getElementById("modal").style.display = "block";
};

window.closeModal = () => {
  document.getElementById("modal").style.display = "none";
};