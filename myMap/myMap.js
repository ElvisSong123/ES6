function myMap(arr) {
    this.bucketLength = 8;
    this.init();
    var self = this;
    if (arr instanceof Array) {
        arr.forEach(function(ele) {
            self.set(ele[0], ele[1]);
        })
    }
}
myMap.prototype.init = function() {
    this.arr = new Array(this.bucketLength);
    for (var i = 0; i < this.bucketLength; i++) {
        this.arr[i] = {
            type: 'bucket_' + i,
            next: null
        }
    }
}
myMap.prototype.hash = function(data) {
    var hash = null;
    if (typeof data != 'string') {
        if (typeof key == 'number') {
            hash = Object.is(key, NaN) ? 0 : key;
        } else if (typeof key == 'object') {
            hash = 1;
        } else if (typeof key == 'boolean') {
            hash = Number(key);
        } else {
            hash = 2;
        }
    } else {
        for (var i = 0; i < 3; i++) {
            hash += data[i] ? data[i].charCodeAt() : 0;
        }
    }
    return hash % 8;
}

myMap.prototype.set = function(key, value) {
    var hash = this.hash(key);
    var bucket = this.arr[hash];
    while (bucket.next) {
        if (bucket.next.key == key) {
            bucket.next.value = value;
            return;
        } else {
            bucket = bucket.next;
        }
    };
    bucket.next = {
        value: value,
        key: key,
    }
}

myMap.prototype.get = function(key) {
    var hash = this.hash(key);
    var bucket = this.arr[hash];
    while (bucket.next) {
        if (bucket.next.key == key) {
            return bucket.next.value;
        } else {
            bucket = bucket.next;
        }
    };
    return undefined;
}

myMap.prototype.delete = function(key) {
    var hash = this.hash(key);
    var bucket = this.arr[hash];
    while (bucket.next) {
        if (bucket.next.key == key) {
            bucket.next = bucket.next.next;
            return true;
        } else {
            bucket = bucket.next;
        }
    }
    return false;
}

myMap.prototype.has = function(key) {
    var hash = this.hash(key);
    var bucket = this.arr[hash];
    while (bucket) {
        if (bucket.next && bucket.next.key == key) {
            return true;
        } else {
            bucket = bucket.next;
        }
    }
    return false;
};

myMap.prototype.clear = function() {
    this.init();
    return true
}