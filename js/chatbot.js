// Toggle Chatbot
// Select DOM Items
const chatbotToggle = document.querySelector("#chatbot-toggle");
const container = document.querySelector("#chatbot-container");
const chatbot  = document.querySelector("#chatbot");

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
    const chatbot = document.getElementById('chatbot');
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
        botTyping("Here's what people usually ask:");
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