define(["jquery","text!site/LoginPanel.html","bootstrap"],
function($,template) {
    var This = function() {
        this.init.apply(this,arguments);
    }

    $.extend(This.prototype, {
        init:function(main) {
            this.main = main;
            this.$el = $("<div class='loginPanel'/>");
            this.$el.html(template);
            this.currentUser = false;
            this.updateDisplay();

            $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
              options.crossDomain ={
                crossDomain: true
              };
              options.xhrFields = {
                withCredentials: true
              };
            });

            if (this.main.editorActive) {
                this.$el.find(".editorLink").addClass("active");
            } else {
                this.$el.find(".browseLink").addClass("active");
            }

            this.refreshCurrentUser();

            var $loginModal = this.$el.find(".loginModal");
            var $registerModal = this.$el.find(".registerModal");

            this.$el.find(".loginLink").click(_.bind(function() {
                $loginModal.modal("show");
                return false;
            },this));

            this.$el.find(".registerLink").click(_.bind(function() {
                $registerModal.modal("show");
                return false;
            },this));

            this.$el.find(".logoutLink").click(_.bind(function() {
                this.logout();
                return false;
            },this));

            $loginModal.find("form").submit(_.bind(function() {
                var email = $loginModal.find(".email").val();
                var password = $loginModal.find(".password").val();

                $loginModal.modal("hide");

                this.login(email,password);
                return false;
            },this));
        },
        refreshCurrentUser:function() {
            console.log("refreshing current user");
            var opt = {
                type:"GET",
                url:this.main.host+"/user/current",
                dataType:"json"
            };
            $.ajax(opt).done(_.bind(function(res) {
                this.currentUser = res;
                $(this).trigger("UserUpdated",[this.currentUser]);
                console.log("got user",this.currentUser);

                this.updateDisplay()
            },this));
        },
        login:function(email,password) {
            var opt = {
                type:"POST",
                dataType:"json",
                url:this.main.host+"/user/login",
                headers: { "Authorization": "Basic " + btoa(email + ":" + password) },
            };

            $.ajax(opt).success(_.bind(function(res) {
                this.currentUser = res;
                $(this).trigger("UserUpdated",[this.currentUser]);

                this.updateDisplay()
            },this));
        },
        logout:function() {
            var opt = {
                type:"POST",
                url:this.main.host+"/user/logout",
            };

            $.ajax(opt).success(_.bind(function(res) {
                this.currentUser = false;
                $(this).trigger("UserUpdated",[this.currentUser]);

                this.updateDisplay()
            },this));
        },
        updateDisplay:function() {
            if (!this.currentUser) {
                $(document.body).removeClass("loggedIn");
                return;
            }
            $(document.body).addClass("loggedIn");
            this.$el.find(".loginName").text(this.currentUser.display);
        },
    });

    return This;
});
