const createBarChart = (data) => {
  // Extract labels and values for the chart
  const labels = data.map((item) => item.platform);
  const values = data.map((item) => item.totalProblems);

  // Create canvas element for the chart
  const canvas = document.createElement("canvas");
  canvas.style.width = "10px"; // Set canvas width
  canvas.style.height = "100px";
  const ctx = canvas.getContext("2d");

  // Create bar chart using Chart.js
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Problems",
          data: values,
          backgroundColor: [
            "red",
            "blue",
            "green",
            "yellow",
            "orange", // Add more colors if needed
          ],
        },
      ],
    },
    options: {},
  });

  // Append canvas element to the DOM
  const chartContainer = document.getElementById("chart-container");
  if (chartContainer) {
    chartContainer.appendChild(canvas);
  } else {
    console.error("Element with ID 'chart-container' not found.");
  }
};

const serverStats = async () => {
  try {
    const response = await fetch("/api/stats", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // Create HTML content for stats
      let htmlContent = "";
      data.forEach((item) => {
        htmlContent += `<div>Platform: ${item.platform}, Total Problems: ${item.totalProblems}</div>`;
      });

      // Create pie chart
      createBarChart(data);
    } else {
      throw new Error("Server Error");
    }
  } catch (error) {
    console.error(error.message);
  }
};

function toggleActiveClass(event, tabId) {
  event.preventDefault(); // Prevent the default action of the anchor tag

  var tabs = document.querySelectorAll(".tabs ul li"); // Get all li elements

  // Loop through all li elements and remove the 'is-active' class
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
  });

  // Add the 'is-active' class to the clicked li element
  event.currentTarget.closest("li").classList.add("is-active");

  // Here you can add code to show/hide the corresponding tab content based on tabId
  if (tabId == "tab2") {
    serverStats();
  } else {
    document.getElementById("chart-container").innerHTML = "";
    document.getElementById("stats").innerHTML = "";
  }
}
