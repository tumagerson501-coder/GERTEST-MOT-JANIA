emailjs.init({
    publicKey: "ywamqqBZAkqJJZ_Py"
});

const form = document.getElementById("contact-form");
const statusText = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function(event){

    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs.sendForm(
        "service_6k1t1rj",
        "template_5r3tsij",
        form
    )
    .then(() => {

        statusText.textContent = "✅ Message sent successfully!";
        statusText.style.color = "green";

        form.reset();

        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";

    })
    .catch((error) => {

        console.log(error);

        statusText.textContent = "❌ Failed to send message.";
        statusText.style.color = "red";

        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    });

});