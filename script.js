
// Select titles and panels
const tabTitles = document.querySelectorAll('.tab-title');
const tabPanels = document.querySelectorAll('.tab-panel');

// Handle tab clicks
tabTitles.forEach(title => {
    title.addEventListener('click', () => {
        // Remove active state
        tabTitles.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        // Add active state to clicked title and panel
        title.classList.add('active');
        document.getElementById(title.dataset.tab).classList.add('active');
    });
});



emailjs.init("pUzv83sszBIK2EPJK");

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    // Send the email using EmailJS
    emailjs.send("service_q3yqac2", "template_gz4mc6d", {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("Message").value
    })
        .then(function (response) {
            alert("Message sent successfully!");
            document.getElementById("contact-form").reset(); // Clear the form
        }, function (error) {
            alert("❌ Failed to send message. Please try again later.");
            console.error("Error:", error);
        });
});
