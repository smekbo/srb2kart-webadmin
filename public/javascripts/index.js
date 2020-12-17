var app = new Vue(
    { 
      el: '#app', 
      data : 
      {
        files: JSON.parse(document.getElementById("data").innerText)
      }
    })