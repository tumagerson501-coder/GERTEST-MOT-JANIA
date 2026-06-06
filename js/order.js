emailjs.init({
    publicKey: "neW_HTlcmb4UHtJoG"
});

const form = document.getElementById("contact-form");
const statusText = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function(event){

    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs.sendForm(
        "service_f8kkp1i",
        "template_lwkeamk",
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