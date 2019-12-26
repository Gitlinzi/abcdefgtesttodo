/**
 * 提供事件对象
 */
;(function () {
    
    //返回指定listener的索引
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i] === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * 给h5发送事件
     */
    var eventSupport = {
        _getEvents: function () {
             return eventSupport._events || (eventSupport._events = {});
        },

        //返回指定事件的所有监听函数
        getListeners: function (name) {
           if (!name) {
                throw new Error("parameter [name] required");
            }
            var events = eventSupport._getEvents();
            var listeners = events[name];
            if (!listeners) {
                listeners = [];
                events[name] = listeners;
            }
            return listeners;
        },

        /**
         * 触发事件(app可以使用该接口给h5发送事件)
         * @param name 事件的名字(必填)
         * @param data 事件参数(可选)
         */
        emit: function (name, data) {
            if (!name) {
                throw new Error("parameter [name] required");
            }
            
            var listeners = eventSupport.getListeners(name);
            
            var listener;
            for (var i = 0; i < listeners.length; i++) {
                listener = listeners[i];
                try {
                    if(data) {
                        data = JSON.parse(data);
                    }
                } catch(e) {
                    //console.log(e);
                }
                
                listener.call(this, data);
            }
            return this;
        },

        //监听指定事件
        on: function (name, listener) {
            if (!name) {
                throw new Error("parameter [name] required");
            }

            if (!listener) {
                throw new Error("parameter [listener] required");
            }

            if (typeof listener != "function") {
                throw new Error("[listener] must be a function");
            }

            var listeners = eventSupport.getListeners(name);

            if (indexOfListener(listeners, listener) < 0) {
                listeners.push(listener);
            }

            return this;
        },

        //移除事件监听函数
        off: function (name, listener) {
             if (!name) {
                throw new Error("parameter [name] required");
            }

            if (!listener) {
                throw new Error("parameter [listener] required");
            }
            var listeners = eventSupport.getListeners(name);
            var ind = indexOfListener(listeners, listener);

            if (ind >= 0) {
                listeners.splice(ind, 1);
            }
            return this;
        },

        //移除指定事件所有的监听函数
        removeAllListeners: function (name) {
            if (!name) {
                throw new Error("parameter [name] required");
            }

            var events = eventSupport._getEvents();

            if (events.hasOwnProperty(name)) {
                delete events[name];
            }

            return this;
        }

    };
    //alias, 方便app调用
    window.eventSupport = eventSupport
})();
