//NOTE - to set token
const setToken = (apiToken) => {
  localStorage.setItem("apiToken", apiToken);
};

//NOTE - To get Token
const getToken = () => {
  return localStorage.getItem("apiToken") || "Token";
};

//Handling Admin Login
const handleLogin = async (event) => {
  event.preventDefault();
  document.getElementById("loginSpinner").style.visibility = "visible";
  document.getElementById("loginStatus").style.visibility = "hidden";
  try {
    const requestBody = {
      username: document.getElementById("adminId").value,
      password: document.getElementById("adminPassword").value,
    };
    const response = await fetch(`/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Request failed with status:", response.status);
      throw new Error("Login failed");
    }
    const data = await response.json();
    // console.log("API Response:", data); //NOTE - Success till here

    if (response.ok && data.token) {
      const apiToken = data.token;
      setToken(apiToken);
      onLoginSuccess();
    } else {
      console.error("Login failed. No token received.");
    }
  } catch (error) {
    document.getElementById("loginStatus").style.visibility = "visible";
    console.error("Error:", error.message);
  } finally {
    document.getElementById("loginSpinner").style.visibility = "hidden";
  }
};

//Admin Auth check
const onLoginSuccess = async () => {
  try {
    const apiToken = getToken();
    const response = await fetch("/admin/adminPanel", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const htmlContent = await response.text();
      document.body.innerHTML = htmlContent;
      console.log("Login Status : Admin Login");
    } else {
      throw new Error("Log Out");
    }
  } catch (error) {
    console.error("Login status:", error.message);
  }
};

//Admin session
window.onload = function () {
  onLoginSuccess();
};

//Admin Logout
const adminLogout = () => {
  localStorage.removeItem("apiToken");
  window.location.href = "/admin";
};

let linkFlag = true;
let catFlag = true;
let idFlag = true;
let selectedMethod = "add";
let requestMethod = "POST";
let endpoint = "addProblem";

//Toggle Admin Panel drop down
function toggleFieldDisabled(fieldId, flag) {
  document.getElementById(fieldId).disabled = flag;
  document.getElementById("id").value = "";
  document.getElementById("link").value = "";
}

//Admin Panel DropDown handling
const handleChange = (event) => {
  selectedMethod = event.target.value;
  // console.log(selectedMethod); //NOTE - Test Pass
  linkFlag = selectedMethod == "add";
  catFlag = selectedMethod == "findById";
  idFlag = selectedMethod == "findByCategory";

  toggleFieldDisabled("category", catFlag);
  toggleFieldDisabled("id", idFlag);
  toggleFieldDisabled("link", !linkFlag);
};

//Handle admin db interaction
const adminDBHandler = async (requestBody) => {
  try {
    const requestMethodName = requestBody.requestMethod;
    const endpointName = requestBody.endpoint;
    const receivedToken = getToken();
    const response = await fetch(`/admin/${endpointName}`, {
      method: `${requestMethodName}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${receivedToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 401) {
      console.log("Unauthorized: Please login.", response.status);
      adminLogout();
    }

    const data = await response.json();
    // console.log("API Response:", data); //NOTE - Test Pass
    displayServerResponse(data);

    if (response.ok) {
      console.log("Request success");
    } else {
      throw new Error("Not Found", response.status);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
  }
};

//Admin Panel form Handling
const handleSubmit = (event) => {
  event.preventDefault();
  let category = document.getElementById("category").value;
  let id = document.getElementById("id").value;
  let platform = document.getElementById("platform").value;
  let link = document.getElementById("link").value;
  let adminData;

  if (selectedMethod == "add") {
    adminData = {
      requestMethod,
      endpoint,
      platform,
      category,
      id,
      link,
    };
  } else if (selectedMethod == "findById") {
    adminData = {
      requestMethod,
      endpoint: "getById",
      platform,
      id,
    };
  } else if (selectedMethod == "findByCategory") {
    adminData = {
      requestMethod,
      endpoint: "getByCategory",
      platform,
      category,
    };
  } else {
    adminData = {
      requestMethod: "DELETE",
      endpoint: "deleteById",
      platform,
      category,
      id,
    };
  }
  // console.log(adminData); //NOTE - Test Pass
  adminDBHandler(adminData);
};

//Server Response Div handle
const displayServerResponse = (jsonResponse) => {
  document.getElementById("server-response").innerHTML = ""; //To clear the div every time it show
  document.getElementById("server-response-main").style.display = "block"; //by default server-main is hidden
  var serverResponseDiv = document.getElementById("server-response");
  if (jsonResponse.error) {
    serverResponseDiv.style.color = "white";
    serverResponseDiv.innerHTML = jsonResponse.error;
  } else if (jsonResponse.message) {
    serverResponseDiv.style.color = "white";
    serverResponseDiv.innerHTML = jsonResponse.message;
  } else {
    if (Array.isArray(jsonResponse.jsonArray)) {
      // Loop through the array and display key and value for each object
      jsonResponse.jsonArray.forEach(function (item) {
        if (item.key && item.value) {
          var key = item.key;
          var value = item.value;

          // Display key and value in the div
          serverResponseDiv.innerHTML +=
            `<p style="color:#fff">ID: ` +
            key +
            `</p><p style="color:#fff">URL: <a href='` +
            value +
            "' target='_blank'>" +
            value +
            "</a></p><hr>";
        }
      });
    } else {
      // Handle the case when "jsonArray" is not an array (only one row)
      if (
        jsonResponse.jsonArray &&
        jsonResponse.jsonArray.key &&
        jsonResponse.jsonArray.value
      ) {
        var key = jsonResponse.jsonArray.key;
        var value = jsonResponse.jsonArray.value;

        // Display key and value in the div
        serverResponseDiv.innerHTML =
          `<p style="color:#fff">ID: ` +
          key +
          `</p><p style="color:#fff">URL: <a href='` +
          value +
          "' target='_blank'>" +
          value +
          "</a></p>";
      }
    }
  }
};

//Handle clear button onclick,by hiding server response main
const hideServerMain = () => {
  document.getElementById("server-response").innerHTML = "";
  document.getElementById("server-response-main").style.display = "none";
};
