const contactForm = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

console.log("contact.js loaded");

contactForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	status.textContent = "Sending...";

	const formData = {
		name: document.querySelector("#name").value.trim(),
		email: document.querySelector("#email").value.trim(),
		message: document.querySelector("#message").value.trim()
	};

	try {
		const response = await fetch("http://localhost:3000/contact", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(formData)
		});

		const data = await response.json();

		if (response.ok) {
			status.textContent = data.message;
			contactForm.reset();
		} else {
			status.textContent = data.message || "Something went wrong.";
		}

		console.log(data);
	} catch (err) {
		console.error(err);
		status.textContent = "Cannot connect to the server.";
	}
});