function myPromise(executor) {
    var self = this;
    self.status = 'pending';
    self.resolveValue = null;
    self.rejectReason = null;
    self.ResolveCallBackList = [];
    self.RejectCallBackList = [];

    function resolve(val) {
        if (self.status == 'pending') {
            self.status = 'Fulfilled';
            self.resolveValue = val;
            self.ResolveCallBackList.forEach(function(ele) {
                ele();
            })
        }
    }

    function reject(reason) {
        if (self.status == 'pending') {
            self.status = 'Rejected';
            self.rejectReason = reason;
            self.RejectCallBackList.forEach(function(ele) {
                ele();
            })
        }
    }
    try {
        executor(resolve, reject);
    } catch (e) {
        rej(e)
    }

}

function ResolutionRetrunPromise(nextPromise, returnValue, res, rej) {
    if (returnValue instanceof myPromise) {
        returnValue.then(function(val) {
            res(val);
        }, function(reason) {
            rej(reason)
        });
    } else {
        res(returnValue);
    }
}
myPromise.prototype.then = function(onFulfilled, onRejected) {
    if (!onFulfilled) {
        onFulfilled = function(val) {
            return val;
        }
    }
    if (!onRejected) {
        onRejected = function(err) {
            throw err
        }
    }
    var self = this;
    var newPromise = new myPromise(function(res, rej) {
        if (self.status == 'Fulfilled') {
            setTimeout(function() {
                try {
                    var value = onFulfilled(self.resolveValue);
                    ResolutionRetrunPromise(newPromise, value, res, rej)
                } catch (e) {
                    rej(e)
                }

            }, 0);
        }
        if (self.status == 'Rejected') {
            setTimeout(function() {
                try {
                    var reason = onRejected(self.rejectReason);
                    ResolutionRetrunPromise(newPromise, reason, res, rej)
                } catch (e) {
                    rej(e)
                }
            }, 0)

        }
        if (self.status == 'pending') {
            if (arguments.length > 0) {
                self.ResolveCallBackList.push(function() {
                    setTimeout(function() {
                        try {
                            var value = onFulfilled(self.resolveValue);
                            ResolutionRetrunPromise(newPromise, value, res, rej)

                        } catch (e) {
                            rej(e)
                        }

                    }, 0)

                });
                self.RejectCallBackList.push(function() {
                    setTimeout(function() {
                        try {
                            var reason = onRejected(self.rejectReason);
                            ResolutionRetrunPromise(newPromise, reason, res, rej)
                        } catch (e) {
                            rej(e)
                        }

                    }, 0)

                })
            }
        }
    })
    return newPromise;
}

myPromise.race = function(promiseArr) {
    return new myPromise(function(resolve, reject) {
        promiseArr.forEach(function(promise, index) {
            promise.then(resolve, reject);
        });
    });
};

myPromise.all = function(promiseArr) {
    var arr = [];
    return new myPromise(function(resolve, reject) {
        promiseArr.forEach(function(promise, index) {
            promise.then((val) => {
                    arr.push(val);
                    if (index == promiseArr.length - 1) {
                        resolve(arr);
                    }
                },
                (reason) => {
                    reject(reason);
                });
        });
    });
}