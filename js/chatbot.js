// Toggle Chatbot
const chatbotToggle = document.querySelector("#chatbot-toggle");
const container = document.querySelector("#chatbot-container");
const chatbot = document.querySelector("#chatbot");

let showChatbot = false;

chatbotToggle.addEventListener("click", toggleChatbot);

function positionBoyInChat() {
	// Wait one frame so the container has its final size
	requestAnimationFrame(() => {
    const rect = container.getBoundingClientRect();

    // Place the boy 12px from the top and right edges of the chat window
    chatbotToggle.style.top = `${rect.top + 12}px`;
    chatbotToggle.style.right = `${window.innerWidth - rect.right + 12}px`;
  });
}

function toggleChatbot() {
	if (!showChatbot) {
		chatbotToggle.classList.add("close-toggle");
		container.classList.add("show-container");
		chatbot.classList.add("show-chatbot")
		showChatbot = true;

		// Position the boy relative to the chat window

	} else {
		chatbotToggle.classList.remove("close-toggle");
		container.classList.remove("show-container");
		chatbot.classList.remove("show-chatbot");
		showChatbot = false;
	}
}

// ===================
// Chatbot Core
// ===================
document.addEventListener("DOMContentLoaded", function () {
	let state = null;
	let projectData = {};
	let conversation = []; // full history

	// --------- Helpers ------------
	function scrollToBottom() {
		//Double rAF so we scroll *after* the browser has painted the new height
	    requestAnimationFrame(() => {
	    	requestAnimationFrame(() => {
	    		container.scrollTop = container.scrollHeight;
	    	});
	    });	
	}

	function addMessage(text, sender = "bot") {
		const msg = document.createElement("div");
		msg.className = `chat-message ${sender}`;
		msg.innerText = text;
		chatbot.appendChild(msg);
		scrollToBottom();
		// Save to history
		conversation.push({ sender, text, timestamp: new Date().toISOString() });
	}

	function botTyping(text, delay = 500) {
		const msg = document.createElement("div");
		msg.className = "chat-message bot typing";
		msg.innerText = "...";
		chatbot.appendChild(msg);
		scrollToBottom();

		setTimeout(() => {
			msg.innerText = text;
			msg.classList.remove("typing");
			scrollToBottom();
			conversation.push({ sender: "bot", text, timestamp: new Date().toISOString() });
		}, delay);
	}

	function showOptions(options) {
		clearOptions();
		const optsContainer = document.createElement("div");
		optsContainer.className = "chat-options";

		options.forEach((opt) => {
			const btn = document.createElement("button");
			btn.innerText = opt.label;
			btn.onclick = () => handleChoice(opt.value);
			optsContainer.appendChild(btn);
		});

		chatbot.appendChild(optsContainer);
		scrollToBottom();
	}

	function clearOptions() {
		const opts = document.querySelector(".chat-options");
		if (opts) opts.remove();
	}

	function showTextInput(placeholder, onSubmit, validate = null) {
		clearOptions();

		const inputWrapper = document.createElement("div");
		inputWrapper.className = "chat-input-wrapper";
		inputWrapper.style.display = "flex";
		inputWrapper.style.flexDirection = "column";
		inputWrapper.style.gap = "8px";
		inputWrapper.style.marginTop = "10px";

		const row = document.createElement("div");
		row.style.display = "flex";
		row.style.gap = "8px";

		const input = document.createElement("input");
		input.type = "text";
		input.placeholder = placeholder;
		input.style.flex = "1";
		input.style.padding = "8px 12px";
		input.style.borderRadius = "2px";
		input.style.border = "1px solid #ccc";

		const errorMsg = document.createElement("div");
		errorMsg.style.color = "#c0392b";
		errorMsg.style.fontSize = "0.85em";
		errorMsg.style.display = "none";

		const btn = document.createElement("button");
		btn.innerText = "Send";

		function trySubmit() {
			const value = input.value.trim();

			if (!value) return;

			if (validate) {
				const result = validate(value);
				if (result !== true) {
					errorMsg.textContent = result; // validate() returns an error string
					errorMsg.style.display = "block";
					input.style.border = "1px solid #c0392b";
					return;
				}
			}

			inputWrapper.remove();
			onSubmit(value);
		}

		btn.onclick = trySubmit;

		input.addEventListener("keypress", (e) => {
			if (e.key === "Enter") trySubmit();
		});

		// Clear the error as soon as they start fixing it
		input.addEventListener("input", () => {
			if (errorMsg.style.display === "block") {
				errorMsg.style.display = "none";
				input.style.border = "1px solid #ccc";
			}
		});

		row.appendChild(input);
		row.appendChild(btn);
		inputWrapper.appendChild(row);
		inputWrapper.appendChild(errorMsg);
		chatbot.appendChild(inputWrapper);
		scrollToBottom();
		input.focus();
	}

	// ----------- Steps -------------
	function nextStep(step) {
		clearOptions();

		switch (step) {
			case 1:
				botTyping("What do you need help with?");
				setTimeout(() => {
					showOptions([
						{ label: "Website", value: "Website" },
						{ label: "Branding", value: "Branding" }, // Change!
						{ label: "Web / Mobile App", value: "App" },
					]);
				}, 600);
				state = "project_type";
				break;
			case 2: 
				botTyping("What is your estimated budget?");
				setTimeout(() => {
					showOptions([
            			{ label: "< 1000€", value: "<1000" },
            			{ label: "1000€ - 5000€", value: "1000-5000" },
            			{ label: "> 5000€", value: ">5000" },
          			]);
				}, 600);
				state = "project_budget";
				break;

			case 3:
				botTyping("When would you like to start?");
				setTimeout(() => {
					showOptions([
						{ label: "ASAP", value: "ASAP" },
						{ label: "Specific date", value: "date" },
						{ label: "Not sure yet", value: "unsure" },
					]);
				}, 600);
				state = "project_start";
				break;

			case 4:
				botTyping("Great. What is your name?");
				setTimeout(() => {
					showTextInput("Your name", (name) => {
						projectData.name = name;
						addMessage(name, "user");
						nextStep(5);
					});
				}, 500);
				state = "project_name";
				break;

			case 5:
				botTyping("And your email address?");
				setTimeout(() => {
					showTextInput("your@email.com", (email) => {
						projectData.email = email;
						addMessage(email, "user");
						nextStep(6);
					},
					(value) => {
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						return emailRegex.test(value)
							? true
							: "That doesn't look like a valid email - please try again.";
					}
				);
			}, 500);
			state = "project_email";
			break;

			case 6:
				botTyping("Perfect. Here is a quick summary:")
				setTimeout(() => {
					addMessage(`• Type: ${projectData.type}`);
					addMessage(`• Budget: ${projectData.budget}`);
					addMessage(`• Start: ${projectData.start}`);
					addMessage(`• Name: ${projectData.name}`);
					addMessage(`• Email: ${projectData.email}`);

					botTyping("Shall I send this over?");
					setTimeout(() => {
						showOptions([
							{ label: "Yes, send it", value: "send_project" },
							{ label: "Start over", value: "project" },
						]);
					}, 700);
				}, 700);
				state = "project_summary";
				break;
		}
	}

	// ----------Main choice handler ----------- 
	window.handleChoice = function (choice) {
		clearOptions();

		// Initial menu choices
		if (choice === "project") {
			projectData = {};
			conversation = []; // reset history for new project
			nextStep(1);
			return;
		}

		if (choice === "faq") {
			botTyping("Here are some common questions:");
			setTimeout(() => {
      		  addMessage("• What's your process?\n• What tools do you use?\n• How long do projects take?");
      		  // You can expand this later with real FAQ answers
      		}, 600);
      		return;
		}
		if (choice === "call") {
			botTyping("You can book a call here:");
			setTimeout(() => {
				const link = document.createElement("a");
				link.href = "https://calendly.com/Your-Calendly";
				link.innerText = "Book via Calendly"
				link.target = "_blank";
				chatbot.appendChild(link);
				chatbot.scrollTop = chatbot.scrollHeight;
			}, 500);
			return;
		}

		// Project flow steps
		if (state === "project_type") {
			projectData.type = choice;
			addMessage(choice, "user");
			nextStep(2);
		} else if (state === "project_budget") {
			projectData.budget = choice;
			addMessage(choice, "user");
			nextStep(3);
		} else if (state === "project_start") {
			projectData.start = choice;
			addMessage(choice, "user");
			nextStep(4);
		} else if (state === "project_summary" && choice === "send_project") {
			sendToBackend();
		}
	};

	// ------- Send to backend ----------
	async function sendToBackend() {
		botTyping("Sending your request...");

		// Build a clean message for the email
		let message = `New lead from Chatbot\n\n`;
		message += `Name: ${projectData.name}\n`;
		message += `Email: ${projectData.email}\n`;
		message += `Project Type: ${projectData.type}\n`;
        message += `Budget: ${projectData.budget}\n`;
        message += `Start: ${projectData.start}\n\n`;
        message += `--- Full Conversation ---\n\n`;

        conversation.forEach((entry) => {
        	const who = entry.sender === "user" ? "User" : "Bot";
        	message += `${who}: ${entry.text}\n`;
        });

        const payload = {
        	name: projectData.name,
        	email: projectData.email,
        	message: message,
        };

        try {
        	console.log("Sending payload:", payload);
        	const response = await fetch("https://suenartetools-backend.onrender.com/contact", {
        		method: "POST",
        		headers: {
        			"Content-Type": "application/json",
        		},
        		body: JSON.stringify(payload),
        	});

        	const data = await response.json();
        	if (response.ok) {
        		botTyping("Got it! I have sent everything. We will get back to you soon.");
        	} else {
        		botTyping("Something went wrong while sending. You can also use the contact form.");
        	}
        } catch (err) {
        	console.error(err);
        	botTyping("Couldn't reach the server. Please try the contact form instead");
        }
	}

	// ---------- Initial Options -------------
	showOptions([
		{ label: "Start a project", value: "project" },
		{ label: "FAQs", value: "faq" },
		{ label: "Book a call", value: "call" },
	]);
});
