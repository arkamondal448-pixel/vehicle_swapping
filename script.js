
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vehicleSwappingForm");
  const status = document.getElementById("statusMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Add timestamp automatically
    document.getElementById("timestamp").value = new Date().toISOString();

    // Collect form data
    const data = {
      timestamp: document.getElementById("timestamp").value,
      representativeName: document.getElementById("representativeName").value,
      riderName: document.getElementById("riderName").value,
      contactNumber: document.getElementById("contactNumber").value,
      breakdownVehicleReg: document.getElementById("breakdownRegNum").value,
      breakdownOdometer: document.getElementById("breakdownOdometer").value,
      breakdownOdometerPhoto: "",
      breakdownLocation: document.getElementById("breakdownLocation").value,
      natureOfBreakdown: document.getElementById("problemDescription").value,
      replacementVehicleReg: document.getElementById("replacementRegNum").value,
      replacementOdometer: document.getElementById("replacementOdometer").value,
      replacementOdometerPhoto: ""
    };

    // Convert uploaded images to Base64
    const breakdownFile = document.getElementById("breakdownOdoPhoto").files[0];
    const replacementFile = document.getElementById("replacementOdoPhoto").files[0];

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        if (!file) return resolve("");
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      data.breakdownOdometerPhoto = await toBase64(breakdownFile);
      data.replacementOdometerPhoto = await toBase64(replacementFile);
    } catch (err) {
      console.error("Image conversion failed:", err);
      status.textContent = "❌ Failed to read uploaded files.";
      status.classList.remove("hidden");
      status.classList.add("text-red-500");
      return;
    }

    // ✅ Replace with your deployed Apps Script EXEC URL
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwRQr91mteeAH73eFMNhPAthNexdBqz04o0HKBIMqhJpSeCvTqNP1URl0JDaLjg_5PJvg/exec";

    // Show loading message
    status.classList.remove("hidden");
    status.classList.remove("text-red-500", "text-green-600");
    status.textContent = "⏳ Submitting... Please wait.";

    try {
      // ✅ Use text/plain to avoid preflight (CORS-safe)
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        status.textContent = "✅ Data saved successfully!";
        status.classList.add("text-green-600");
        form.reset();
      } else {
        status.textContent = "❌ Error: " + (result.message || "Unknown error");
        status.classList.add("text-red-500");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      status.textContent = "⚠️ Network or Script error: " + err.message;
      status.classList.add("text-red-500");
    }
  });
});
