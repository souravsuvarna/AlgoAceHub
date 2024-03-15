const createBarChart = (data) => {
  // Extract labels and values for the chart
  const labels = data.map((item) => {
    if (item.platform === "lc") {
      return "Leetcode";
    } else if (item.platform === "gfg") {
      return "GFG";
    } else if (item.platform === "cn") {
      return "Coding ninjas";
    }
    return "InterviewBit";
  });
  const values = data.map((item) => item.totalProblems);

  // Create canvas element for the chart
  const canvas = document.createElement("canvas");
  canvas.style.width = "100px"; // Set canvas width
  canvas.style.height = "150px";
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
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
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
