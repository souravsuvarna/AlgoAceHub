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

// Display db stats
const serverStats = async () => {
  document.getElementById("statSpinner").style.display = "flex";
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
  } finally {
    document.getElementById("statSpinner").style.display = "none";
  }
};

const gotoProblemPage = () => {
  let dynamicURL = document.getElementById("problem-link-button").href;
  console.log(dynamicURL);
  window.open(dynamicURL, "_blank");
};

//Hide serverResponse div
const hideServerResponse = () => {
  document.getElementById("server-response").style.display = "none";
  document.getElementById("notFound").style.display = "none";
};

//Problem filter form submission
const handleProblemFilter = async (event) => {
  event.preventDefault();
  window.scrollBy(0, 100);
  document.getElementById("spinner").style.display = "flex";
  hideServerResponse();
  const platform = document.getElementById("platform").value;
  const category = document.getElementById("category").value;
  const requestBody = {
    platform,
    category,
  };
  try {
    const response = await fetch(`/api/getProblem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      document.getElementById("notFound").style.display = "block";
      console.error("Request failed with status:", response.status);
      throw new Error("Sever Error, Try Again");
    } else {
      const data = await response.json();
      console.log(data);
      const totalRecords = data.totalRecords;
      const problemUrl = data.data.value;
      console.log(problemUrl);
      console.log(totalRecords);
      document.getElementById("server-response").style.display = "block";
      document.getElementById(
        "message"
      ).innerHTML = `Picked one for you out of ${totalRecords} filtered results..!`;
      document.getElementById("problem-link-button").href = problemUrl;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
};

// Handling Tabs
function toggleActiveClass(event, tabId) {
  event.preventDefault(); // Prevent the default action of the anchor tag
  document.getElementById("chart-container").innerHTML = "";
  if (tabId == "stats") {
    document.getElementById("probFilterBody").style.display = "none";
    serverStats();
    document.getElementById("chart-container").style.display = "block";
  } else {
    document.getElementById("chart-container").style.display = "none";
    document.getElementById("probFilterBody").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Add a click event on each of them
  $navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });
});
