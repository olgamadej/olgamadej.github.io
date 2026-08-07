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
	async function wakeBackend() {
		try {
			await fetch("https://suenartetools-backend.onrender.com/health", {
				method: "GET",
				mode: "cors",
				cache: "no-store"
			});
			console.log("Backend awake");
		} catch (err) {
			console.log("Backend wake attempt:", err);
		}
	}

	if (!showChatbot) {
		wakeBackend();

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
		    botTyping("What can I help you with today?");
		    setTimeout(() => {
		    showOptions([
		    { label: "Website", value: "Website" },
		    { label: "AI Solutions", value: "AI" },
		    { label: "Web / Mobile App", value: "App" },
		    ]);
		    }, 600);
		    state = "project_type";
		    break;
		  
		  // ==========================
		  // WEBSITE
		  // ==========================
		  
		  case 2:
		  	if (projectData.type !== "Website") {
		  	nextStep(5);
		  	return;
		  	}
		  	
		  	botTyping("What kind of website do you need?");
		  	setTimeout(() => {
		  	showOptions([
		  	{ label: "Business Website", value: "business" },
		  	{ label: "Landing Page", value: "landing" },
		  	{ label: "E-commerce", value: "shop" },
		  	{ label: "Portfolio", value: "portfolio" },
		  	{ label: "Other (describe your idea)", value: "custom" },
		  	{ label: "Not sure", value: "unsure" },
		  	]);
		  	}, 600);
		  	state = "website_type";
		  	break;
		  
		  case 3:
		    if (projectData.websiteType !== "custom") {
		    nextStep(4);
		    return;
		    }
		    
		    botTyping("Tell me about your website idea.");
		    setTimeout(() => {
		    showTextInput("Describe your idea...", (text) => {
		    projectData.websiteIdea = text;
		    addMessage(text, "user");
		    nextStep(4);
		    });
		    }, 500);
		    state = "website_custom";
		    break;
		  
		  case 4:
		    botTyping("Would you like any extras?");
		    setTimeout(() => {
		    showOptions([
		    { label: "AI Chatbot", value: "chatbot" },
		    { label: "AI Automation", value: "automation" },
		    { label: "Branding", value: "branding" },
		    { label: "SEO", value: "seo" },
		    { label: "Other (describe your idea)", value: "other" },
		    { label: "No extras", value: "none" },
		    ]);
		    }, 600);
		    state = "website_extras";
		    break;
		  
		  // ==========================
		  // AI
		  // ==========================
		  
		  case 5:
		  if (projectData.type !== "AI") {
		  nextStep(8);
		  return;
		  }
		  
		  botTyping("What would you like AI to help you with?");
		  setTimeout(() => {
		  showOptions([
		  { label: "AI Chatbot", value: "chatbot" },
		  { label: "AI Assistant", value: "assistant" },
		  { label: "Workflow Automation", value: "automation" },
		  { label: "Content Generation", value: "content" },
		  { label: "Translation & Multilingual AI", value: "translation" },
		  { label: "Other (describe your idea)", value: "custom" },
		  { label: "Not sure", value: "unsure" },
		  ]);
		  }, 600);
		  state = "ai_type";
		  break;
		  
		  case 6:
		  if (projectData.aiType !== "custom") {
		  nextStep(8);
		  return;
		  }
		  
		  botTyping("Tell me about your AI idea.");
		  setTimeout(() => {
		  showTextInput("Describe your idea...", (text) => {
		  projectData.aiIdea = text;
		  addMessage(text, "user");
		  nextStep(8);
		  });
		  }, 500);
		  state = "ai_custom";
		  break;
		  
		  // ==========================
		  // APPS
		  // ==========================
		  
		  case 8:
		  if (projectData.type !== "App") {
		  nextStep(11);
		  return;
		  }
		  
		  botTyping("What are you looking to build?");
		  setTimeout(() => {
		  showOptions([
		  { label: "Web Application", value: "webapp" },
		  { label: "Mobile App", value: "mobile" },
		  { label: "Both", value: "both" },
		  { label: "Other (describe your idea)", value: "custom" },
		  { label: "Not sure", value: "unsure" },
		  ]);
		  }, 600);
		  state = "app_type";
		  break;
		  
		  case 9:
		  if (projectData.appType !== "custom") {
		  nextStep(11);
		  return;
		  }
		  
		  botTyping("Tell me about your app idea.");
		  setTimeout(() => {
		  showTextInput("Describe your idea...", (text) => {
		  projectData.appIdea = text;
		  addMessage(text, "user");
		  nextStep(11);
		  });
		  }, 500);
		  state = "app_custom";
		  break;
		  
		  // ==========================
		  // COMMON QUESTIONS
		  // ==========================
		  
		  case 11:
		  botTyping("Is there anything else you'd like me to know about your project? (Optional)");
		  setTimeout(() => {
		  showTextInput("Additional details...", (text) => {
		  projectData.notes = text;
		  addMessage(text, "user");
		  nextStep(12);
		  });
		  }, 500);
		  state = "project_notes";
		  break;
		  
		  case 12:
		  botTyping("What is your estimated budget?");
		  setTimeout(() => {
		  showOptions([
		  { label: "< €1,000", value: "<1000" },
		  { label: "€1,000 – €5,000", value: "1000-5000" },
		  { label: "> €5,000", value: ">5000" },
		  ]);
		  }, 600);
		  state = "project_budget";
		  break;
		  
		  case 13:
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
		  
		  case 14:
		  botTyping("Great! What's your name?");
		  setTimeout(() => {
	    	showTextInput("Your name", (name) => {
	    		projectData.name = name;
	    		addMessage(name, "user");
	    		nextStep(15);
	    	});
	      }, 500);

		  state = "project_name";
		  	  break;
		  
		  case 15:
		  botTyping("And your email address?");
		  setTimeout(() => {
			showTextInput(
				"your@email.com",
				(email) => {
					projectData.email = email;
					addMessage(email, "user");
					nextStep(16);
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
		  
		  case 16:
		  botTyping("Perfect. Here's a summary of your project.");
		  setTimeout(() => {

		addMessage(`• Type: ${projectData.type}`);
		
		if (projectData.websiteType) {
			addMessage(`• Website: ${projectData.websiteType}`);
		}

		if (projectData.aiType) {
			addMessage(`• AI Solution: ${projectData.aiType}`);
		}

		if (projectData.appType) {
			addMessage(`• App: ${projectData.appType}`);
		}

		if (projectData.notes) {
			addMessage(`• Notes: ${projectData.notes}`);
		}

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
		} else if (state === "website_type") {
            projectData.websiteType = choice;
            addMessage(choice, "user");
            nextStep(3);
    
        } else if (state === "website_extras") {
            projectData.websiteExtra = choice;
            addMessage(choice, "user");
            nextStep(11);
    
        } else if (state === "ai_type") {
            projectData.aiType = choice;
            addMessage(choice, "user");
            nextStep(6);

    	} else if (state === "app_type") {
    	    projectData.appType = choice;
    	    addMessage(choice, "user");
    	    nextStep(9);	
		} else if (state === "project_budget") {
			projectData.budget = choice;
			addMessage(choice, "user");
			nextStep(13);
		} else if (state === "project_start") {
			projectData.start = choice;
			addMessage(choice, "user");
			nextStep(14);
		} else if (state === "project_summary" && choice === "send_project") {
			sendToBackend();
		}
	};

	// ------- Send to backend ----------
	async function sendToBackend() {
	console.log("SEND FUNCTION STARTED");
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

		console.log("Backend response status:", response.status, response.statusText);

		// Try to parse as JSON if possible, otherwise grab text
		let data = null;
		const contentType = response.headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			try {
				data = await response.json();
			} catch (e) {
				console.warn("Failed to parse JSON from backend:", e);
				data = { message: await response.text() };
			}
		} else {
			const text = await response.text();
			data = { message: text };
		}

		console.log("Backend response body:", data);

		if (response.ok) {
			botTyping(data.message || "Got it! I have sent everything. We will get back to you soon.");
		} else {
			// Show specific error from backend if available
			const msg = data?.message || `Server returned ${response.status}`;
			botTyping(`Something went wrong while sending: ${msg}. You can also use the contact form.`);
		}
	} catch (err) {
		console.error("Fetch failed:", err);
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
