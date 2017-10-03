ClickHandler = (function() {

    var Subscribable = function() {
        var that = {};
        that._subscribers = [];
        var isSetup = false;

        that._subscription = function() {};

        function setup() {
            if (!isSetup && that._subscribers.length > 0) {
                that._subscription(true);
                setup = true;
            }
        }

        function close() {
            if (setup && that._subscribers.length == 0) {
                that._subscription(false);
                setup = false;
            }
        }

        that.connect = function(callback) {
            if (that._subscribers.indexOf(callback) < 0) {
                that._subscribers.push(callback);
                setup();
            }
        };

        that.disconnect = function(callback) {
            var i = that._subscribers.indexOf(callback);
            if (i >= 0) {
                that._subscribers.splice(i, 1);
                close();
            }
        };

        return that;

    }

    MousePressEvent = (function() {
        var that = new Subscribable();

        that._subscription = function(connect) {
            if (connect) {
                Controller.mousePressEvent.connect(mousePressEvent);
            } else {
                Controller.mousePressEvent.disconnect(mousePressEvent);
            }
        }

        function mousePressEvent(e) {
            var pickRay = Camera.computePickRay(e.x, e.y);

            var avatar = AvatarManager.findRayIntersection(pickRay);
            avatar.type = "avatar";
            var entity = Entities.findRayIntersection(pickRay, true);
            entity.type = "entity";
            var overly = Overlays.findRayIntersection(pickRay, true);
            overly.type = "overlay";

            var results = [];
            if (avatar.intersects) results.push(avatar);
            if (entity.intersects) results.push(entity);
            if (overly.intersects) results.push(overly);

            if (results.length > 0) {
                if (results.length > 1) {
                    results = results.sort(function(a, b) {
                        if (a.distance > b.distance) return 1;
                        else return -1;
                    });
                }

                e.intersection = results[0];
            } else {
                e.intersection = null;
            }

            for (var i = 0; i < that._subscribers.length; i++) {
                that._subscribers[i](e);
            }
        }

        return that;
    })();

    MouseMoveEvent = (function() {
        var that = new Subscribable();
        var last = { x: 0, y: 0 };

        that._subscription = function(connect) {
            if (connect) {
                Controller.mouseMoveEvent.connect(mouseMoveEvent);
            } else {
                Controller.mouseMoveEvent.disconnect(mouseMoveEvent);
            }
        }

        function mouseMoveEvent(e) {

            e.moved = {
                x: e.x - last.x,
                y: e.y - last.y
            };

            for (var i = 0; i < that._subscribers.length; i++) {
                that._subscribers[i](e);
            }

            last.x = e.x;
            last.y = e.y;
        }

        that.center = function() {
            var pos = Reticle.getMaximumPosition();
            pos.x *= 0.5;
            pos.y *= 0.5;
            Reticle.setPosition(pos);
            last = pos;
        }

        return that;
    })();


    MouseReleaseEvent = (function() {
        var that = new Subscribable();

        that._subscription = function(connect) {
            if (connect) {
                Controller.mouseReleaseEvent.connect(mouseReleaseEvent);
            } else {
                Controller.mouseReleaseEvent.disconnect(mouseReleaseEvent);
            }
        }

        function mouseReleaseEvent(e) {
            var pickRay = Camera.computePickRay(e.x, e.y);

            var avatar = AvatarManager.findRayIntersection(pickRay);
            avatar.type = "avatar";
            var entity = Entities.findRayIntersection(pickRay, true);
            entity.type = "entity";
            var overly = Overlays.findRayIntersection(pickRay, true);
            overly.type = "overlay";

            var results = [];
            if (avatar.intersects) results.push(avatar);
            if (entity.intersects) results.push(entity);
            if (overly.intersects) results.push(overly);

            if (results.length > 0) {
                if (results.length > 1) {
                    results = results.sort(function(a, b) {
                        if (a.distance > b.distance) return 1;
                        else return -1;
                    });
                }

                e.intersection = results[0];
            } else {
                e.intersection = null;
            }

            for (var i = 0; i < that._subscribers.length; i++) {
                that._subscribers[i](e);
            }
        }

        return that;
    })();

    var that = {};

    that.mousePressEvent = MousePressEvent;
    that.mouseReleaseEvent = MouseReleaseEvent;
    that.mouseMoveEvent = MouseMoveEvent;

    return that;
})();