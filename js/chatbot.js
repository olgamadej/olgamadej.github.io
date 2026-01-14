// Toggle Chatbot
// Select DOM Items
const chatbotToggle = document.querySelector("#chatbot-toggle");
const container = document.querySelector("#chatbot-container");
const chatbot  = document.querySelector("#chatbot");

// Chatbot Data
const faqData = [
  {
    id: "process",
    category: "Workflow",
    priority: 1,
    questions: [
      "What is your process?", "How do you usually work?"
    ],
    answer: `
I usually work in clear phases: 
 * Discovery and requirements
 * Design and architecture
 * Development
 * Feedback and iteration
 * Delivery

You are involved at every step so there are no surprises.`,
    followUps: ["tools", "timeline"]
  },
  {
    id: "stack",
    category: "Technical",
    priority: 2,
    questions: [
      "What tech stack do you use?", "What tech stack do you work with?"
    ],
    answer: `    
The stack depends on the problem being solved.

However, I most commonly use:
 * Python (AI pipelines, automation, data processing)
 * Django / FastAPI (APIs, AI services)
 * JavaScript (frontend logic, integrations)
 * REST APIs and background workers.`,
  followUps: ["ai_use_cases", "integration"]
  },
  {
    id: "timeline",
    category: "Planning",
    priority: 1,
    questions: [

    ]
  },
  {
    id: "ai_use_cases",
    category: "AI Solutions",
    priority: 1,
    questions: [
      "What kind of AI solutions do you build?", "How do you use AI in projects?"
    ],
    answer: `
Typical AI-related work includes:
 * Chatbots and assistants
 * Automation of internal workflows
 * AI-powered search or summarization
 * Data enrichment and analysis
 * Integrating LLMs into existing systems

My goal is always to solve a concrete business problem, not to add AI for its own sake.`,
    followUps: ["integration", "data"]
  },
  {
    id: "integration",
    category: "Architecture",
    priority: 1,
    questions: [
      "How do you integrate AI into existing systems?",
      "Can you add AI to an existing product?"
    ],
    answer: `
Yes - most projects involve integration rather than greenfield builds.

My typical approach:
 1st: Analyze the existing architecture.
 2nd: Identify where AI adds value.
 3rd: Expose AI logic via APIs.
 4th: Integrate with front end or backend services.
 5th: Ensure reliability and monitoring.

My goal is minimal disruption with maximum impact.
`,
followUps: ["data", "security"]
  },
  {
    id: "data",
    category: "AI Constraints",
    priority: 2,
    questions: [
      "What data do you need?",
      "Do I need a lot of data?"
    ],
    answer: "It depends on the use case. Some solutions work with existing structured data, others use third-party models and APIs. Moreover, not every project requires large datasets. Part of the work is determining what's feasible with the data you already have.",
    followUps: ["security", "timeline"]
  },
  {
    id: "security",
    category: "AI Constraints",
    priority: 2,
    questions: [
      "Is my data secure?", "How do you handle privacy?"
    ],
    answer: "Security and privacy are considered from the start of every project. I aim to minimize data retention, ensure secure communication between services and APIs, and keep a clear separation of concerns within the system architecture. When required, compliance and regulatory constraints are taken into account as part of the design. The exact measures always depend on the project context, the data involved, and the applicable regulations.",
    followUps: ["integration", "budget"]
  }
]

//Set Initial State of ChatBot to be Hidden
let showChatbot = false;

chatbotToggle.addEventListener("click", toggleChatbot);

function toggleChatbot() {
    if (!showChatbot) {
        chatbotToggle.classList.add("close-toggle");
        container.classList.add("show-container");
        chatbot.classList.add("show-chatbot");

        // Set Chatbot State
        showChatbot = true;
    } else {
        chatbotToggle.classList.remove("close-toggle");
        container.classList.remove("show-container");
        chatbot.classList.remove("show-chatbot");

        // Set Chatbot State
        showChatbot = false;
    }
}


// Chatbot logic
document.addEventListener("DOMContentLoaded", function() {  
    //const chatbot = document.getElementById('chatbot');
    let state = null;
    let projectData = {};

    function addMessage(text, sender = 'bot') {
      const msg = document.createElement('div');
      msg.className = `chat-message ${sender}`;
      msg.innerText = text;
      chatbot.appendChild(msg);
      chatbot.scrollTop = chatbot.scrollHeight;
    }

    function showOptions(options) {
      clearOptions();

      const container = document.createElement("div");
      container.className = "chat-options";

      options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.label;
        btn.onclick = () => handleChoice(opt.value);
        container.appendChild(btn);
      });

      chatbot.appendChild(container);
      chatbot.scrollTop = chatbot.scrollHeight;
    }

    function clearOptions() {
      const opts = document.querySelector('.chat-options');
      if (opts) opts.remove();
    }

    function botTyping(text, delay = 500) {
      const msg = document.createElement("div");
      msg.className = "chat-message bot typing";
      msg.innerText = "...";
      chatbot.appendChild(msg);
      chatbot.scrollTop = chatbot.scrollHeight;

      setTimeout(() => {
        msg.innerText = text;
        msg.classList.remove("typing");
        chatbot.scrollTop = chatbot.scrollHeight;
      }, delay);
    }

    // Step Form
    function nextStep(step) {
      clearOptions();
      switch (step) {
        case 1: 
          botTyping("What do you need help with?");
          setTimeout(() => 
            showOptions([
              { label: "Website", value: "Website" },
              { label: "Branding", value: "Branding" },
              { label: "Web / Mobile App", value: "App" },
            ]), 600
          );
          state = "project_type";
          break;
        case 2: 
          botTyping("What's your estimated budget?");
          setTimeout(() =>
            showOptions([
              { label: "< 1000€", value: "<1000" },
              { label: "1000€ - 5000€", value: "1000-5000" },
              { label: "> 5000€", value: ">5000" },
            ]), 600
          );
          state = "project_budget";
          break;
        case 3:
          botTyping("When would you like to start?");
          setTimeout(() => 
            showOptions([
              { label: "ASAP", value: "ASAP" },
              { label: "Specific date", value: "date" },
              { label: "Not sure yet", value: "unsure" },
            ]), 600
          );
          state = "project_start";
          break;
        case 4:
          botTyping("Awesome! Here's what you told me:");
          setTimeout(() => {
            addMessage(`• Type: ${projectData.type}`);
            addMessage(`• Budget: ${projectData.budget}`);
            addMessage(`• Start: ${projectData.start}`);
            botTyping("Want to send this my way?");
            setTimeout(() => 
              showOptions([
                { label: "Yes, send it.", value: "send_project" },
                { label: "Start over", value: "project" },
              ]), 600
            );
          }, 800);
          state = "project_summary";
          break;
      }
    }

    // Attach handleChoice to window so it's globally accessible 
    window.handleChoice = function(choice) {
      clearOptions();

      if (choice === 'project') {
        projectData = {}; // data reset
        nextStep(1);
      } else if (choice === 'availability') {
        botTyping("What are your time constraints?");
        setTimeout(() => addMessage("How complex is your project?"), 800);
        //Some logic to manage the questions and logic to see availability
      } else if (choice === "faq") {
        botTyping("Here are some common questions about how I work with AI and systems:");
        setTimeout(() => {
          addMessage("• What's your process?\n• What tools do you use?\n• How long do projects take?");
        }, 600);
      } else if (choice === 'call') {
        botTyping("You can book a call here:");
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = 'https://calendly.com/Your-Calendly';
          link.innerText = 'Book via Calendly';
          link.target = '_blank';
          chatbot.appendChild(link);
          chatbot.scrollTop = chatbot.scrollHeight;
        }, 500);
      }

      // Step by step - form wizard
      else if (state === "project_type") {
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
        botTyping("Got everything I need! I will reach out shortly. ")
      }
    };

    // Optional: Input listener for when there is  a user input field
    /*
    const input = document.getElementById("chat-input"); // Optional field
    if (input) {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const value = input.value.trim();
          if (!value) return;

          addMessage(value, "user");
          input.value = "";

          // Respond based on state 
          if (state === "awaiting_project") {
            botTyping("Awesome. I'll review that and get back to you soon.");
            state = null;
          } else if (state === "awaiting_time") {
            botTyping("Thanks for that info. I'll check my availability and follow up!");
            state = null; 
          } else {
           botTyping("Thanks! Let me know how else I can help.");
          }
        }
      });
    }
    */

    // Initial options
    showOptions([
      { label: "Start a project", value: "project" },
      //{ label: "Check availability", value: "availability" },
      { label: "FAQs", value: "faq" },
      { label: "Book a call", value: "call" },
    ]);
  });