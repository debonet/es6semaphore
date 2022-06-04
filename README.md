# es6mutex.js

Simple, dependency-free Semaphore tools for ES6.

## INSTALLATION
p
```
npm install @debonet/es6semaphore
```

### OVERVIEW

es6semaphore provides a Promises-based semaphore object for
tracking resources or other operations whose concurrency must
be limited.

## TYPICAL USAGE 

```wait()``` and ```signal()``` have the typical Semaphore semantics
and can be used as ```Promises``` or with ```async/await``` syntax, e.g.:

```
const sem = new Semaphore(2);

// wait until a resource is available, then claim one
await sem.wait();

// do something sensitive
...

// release the resource freeing up other events to proceed
sem.signal();

```

Here's an example:

```javascript

const Semaphore = require( "@debonet/es6semaphore" );

const sem = new Semaphore(2);

const timeStart = new Date().getTime();

async function f(ch) {
	await sem.wait();
	await sleep(1000);
	console.log( "Here with",ch,'at', new Date().getTime() - tmStart; );
	sem.signal();
}

// these will run two at a time, taking two seconds to complete
f('a');
f('b');
f('c');
f('d');
```

and generate an output somthing like:
> Here with a at 1005
> Here with b at 1005
> Here with c at 2007
> Here widh d at 2008



## NON-CLAIMING OPERATIONS

Sometimes it's useful to wait on the semaphore without claiming 
a resource. A series of functions are available for various tests

```when( test )```
```whenall()```
```whennone()```
```whenany()```

for example:

```javascript
f('a');
f('b');
f('c');
f('d');
console.log("all have been queued");
await sem.when(c => c==1 );
console.log("one is available");
await sem.whenall();
console.log("all are available");
```

will produce:

> all have been queued
> Here with a at 1005
> Here with b at 1005
> Here with c at 2007
> one is available
> Here widh d at 2008
> all are available


# API

## Class API

### Semaphore.prototype.wait( d = 1 )
### Semaphore.prototype.get( d = 1 )
### Semaphore.prototype.lock( d = 1)
### Semaphore.prototype.fpGet( d = 1)

Waits until the indicated number of resources are available, 
and then claims them before resolving

Use with await

```javascript
const semaphore = new Semaphore(2);
await sem.wait();
// do whatever 
``

or with Promise chains:

```javascript
 sem.wait().then( /* do whatever */ );
```
 
### Semaphore.prototype.signal( d = 1 )
### Semaphore.prototype.release( d = 1 )
### Semaphore.prototype.unlock( d = 1)
### Semaphore.prototype.fpRelease( d = 1 )

Releases control over the indicated number of semaphore resources allowing the next tasks waiting for control to proceed.

```javascript
const semaphore = new Semaphore( 5 );
await sem.wait( );
// do whatever 
sem.signal( );
```


### Semaphore.prototype.when( test = (remaining, available) => remaining > 0 )
### Semaphore.prototype.check( test = (remaining, available) => remaining > 0 )
### Semaphore.prototype.fpWhen( test = (remaining, available) => remaining > 0 )

Proceeds when the provided test function evaluates to true given the number of resources that are currently remaining and the available number of resources

```javascript
// wait for three resources to be remaining
sem.when( c => c == 3);
// do whatever 
```


### Semaphore.prototype.getWhen( get, test = (remaining, available) => remaining > get )
### Semaphore.prototype.fpGetWhen( get, test = (remaining, available) => remaining > get )

Claims the indicated number of resources to get when the provided test function evaluates to true, given the number of resources that are currently remaining and the available number of resources

```javascript
// wait for three resources to be remaining and get them
sem.getWhen( 3, c => c == 3 );
// do whatever
sem.release( 3 );
```

### Semaphore.prototype.whenAll( )
### Semaphore.prototype.fpWhenAll( )

Proceeds when all of the resources are remaining


### Semaphore.prototype.whenNone( )
### Semaphore.prototype.fpWhenNone( )

Proceeds when none of the resources are remaining (i.e. when all have been claimed) 


### Semaphore.prototype.remaining( )
### Semaphore.prototype.fcRemaining( )

the number of resources remaining

### Semaphore.prototype.available( )
### Semaphore.prototype.fcAvailable( )

the total number of resources available



## APPENDIX

definition of ```sleep()``` used in the example above

```javascript
	function sleep( dtm ){
		return new Promise( fOk => setTimeout( fOk, dtm ));
	}
```

