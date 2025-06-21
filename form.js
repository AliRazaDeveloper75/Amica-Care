function getNextId() {
  const counter = localStorage.getItem("amicaCareFormCounter");
  const nextId = counter ? parseInt(counter) + 1 : 1;
  localStorage.setItem("amicaCareFormCounter", nextId);
  return nextId.toString();
}

document.getElementById("careForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};

  formData.forEach((value, key) => {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });

  const id = getNextId();
  const storedMap = JSON.parse(localStorage.getItem("amicaCareFormMap")) || {};
  storedMap[id] = data;
  localStorage.setItem("amicaCareFormMap", JSON.stringify(storedMap));

  alert("Form data saved with ID: " + id);
  e.target.reset();
});

function updateAdminStatus() {
  const status = document.getElementById("adminStatus").value;
  localStorage.setItem("amicaCareAdminStatus", status);
  document.getElementById(
    "statusOutput"
  ).innerText = `Current Status: ${status}`;
}

window.onload = () => {
  const savedStatus = localStorage.getItem("amicaCareAdminStatus");
  if (savedStatus) {
    document.getElementById("adminStatus").value = savedStatus;
    document.getElementById(
      "statusOutput"
    ).innerText = `Current Status: ${savedStatus}`;
  }
};
