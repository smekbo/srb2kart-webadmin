var app = new Vue(
{ 
  el: '#app', 
  data : 
  {
    serverInfo : {}
  },
  created : function () 
  {
    this.loadData;
  },
  sockets:
  {
    connect : function()
    {
      console.log("Connected");
    }
  },
  methods :
  {
    getAddons : function(init = false)
    {
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function() 
      {
        let data = JSON.parse(this.responseText);
        data.forEach((addon, index) => {
          if (init)
          {
            Vue.set(app.loaded, index, addon);
          }
          addon.loaded = app.isLoaded(addon);
          Vue.set(app.addons, index, addon);
        });
      });
      oReq.open("GET", "/addons/get");
      oReq.send();      
    },
    loadData : function()
    {
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function() 
      {
        let data = JSON.parse(this.responseText);
        Vue.set(app.data, 0, data);
      });
      oReq.open("GET", "/server/getData");
      oReq.send();    
    },
    removeAddon : function() 
    {

    },
    uploadAddon : function()
    {
      var formData = new FormData();
      formData.append("addon", event.target.files[0]);

      this.callApi("/addons/upload", formData);
    },
    restartServer : function()
    {
      this.callApi("/server/restart");
    },
    callApi : function(endpoint, data = "")
    {
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function() 
      {
        app.getAddons();
      });
      oReq.open("POST", endpoint);
      oReq.send(data);      

      return false;      
    },
    isLoaded : function(addon)
    {
      let found = false;
      app.loaded.forEach(item => {
        if (item.filename == addon.filename)
        {
          found = true;
        }
      });
      if(!found)
      {
        return false
      }
      else 
      {
        return true
      }
    }
  }
})