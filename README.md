# es6mutex.js

Simple, dependency-free Semaphore tools for ES6.

## INSTALLATION

```
npm install @debonet/es6semaphore
```

### OVERVIEW

es6semaphore provides a Promises-based semaphore object for
tracking resources or other operations whose concurrency must
be limited.

## TYPICAL USAGE 

`wait()` and `signal()` have the typical Semaphore semantics
and can be used as `Promises` or with `async/await` syntax, e.g.:

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
> Here with a at 1005<br/>
> Here with b at 1005<br/>
> Here with c at 2007<br/>
> Here widh d at 2008<br/>



## NON-CLAIMING OPERATIONS

Sometimes it's useful to wait on the semaphore without claiming 
a resource. A series of functions are available for various tests

```when( test )```
```whenAll()```
```whenNone()```
```whenAny()```

for example:

```javascript
f('a');
f('b');
f('c');
f('d');
console.log("all have been queued");
await sem.when(c => c==1 );
console.log("one is available");
await sem.whenAll();
console.log("all are available");
```

will produce:

> all have been queued<br/>
> Here with a at 1005<br/>
> Here with b at 1005<br/>
> Here with c at 2007<br/>
> one is available<br/>
> Here widh d at 2008<br/>
> all are available<br/>


# Semaphore member functions

## typical semaphore functions

### `wait( d = 1 )`
### `get( d = 1 )`
### `lock( d = 1 )`
### `fpGet( d = 1 )`

Waits until the indicated number of resources are available, 
and then claims them before resolving

Use with await

```javascript
const semaphore = new Semaphore(2);
await sem.wait();
// do whatever 
```

or with Promise chains:

```javascript
 sem.wait().then( /* do whatever */ );
```
 
### `signal( d = 1 )`
### `release( d = 1 )`
### `unlock( d = 1 )`
### `fpRelease( d = 1 )`

Releases control over the indicated number of semaphore resources allowing the next tasks waiting for control to proceed.

```javascript
const semaphore = new Semaphore( 5 );
await sem.wait( );
// do whatever 
sem.signal( );
```

## Resource count functions

### `remaining( )`
### `fcRemaining( )`

the number of resources remaining

### `available( )`
### `fcAvailable( )`

the total number of resources available



## Non-claming resources waiting functions

these functions allow events to await some semaphore condition before proceeding. All work with `async/await` or as `Promises`

### `whenAny( )`
### `fpWhenAny( )`

Proceeds when any of the resources remain unused (i.e. `when remaining() > 0`)

Example:
```javascript
sem.whenAny().then( /* do something */)
```

### `whenAll( )`
### `fpWhenAll( )`

Proceeds when all of the resources are unused (i.e. when `remaining() == available()` )

Example:
```javascript
await sem.whenAll();
// do something 
```

### `whenNone( )`
### `fpWhenNone( )`

Proceeds when none of the resources remain ununsed (i.e. when all have been used, `remaining() == 0`) 



## Advanced conditions

these methods allow for generalized tests, and claim amounts 

### `when( test = (remaining, available) => remaining > 0 )`
### `check( test = (remaining, available) => remaining > 0 )`
### `fpWhen( test = (remaining, available) => remaining > 0 )`

Proceeds when the provided test function evaluates to true given the number of resources that are currently remaining and the available number of resources

```javascript
// wait for three resources to be remaining
sem.when( c => c == 3);
// do whatever 
```
### `getWhen( requested, test = (remaining, requested, available) => remaining >= requested )`
### `fpGetWhen( requested, test = (remaining, requested, available) => remaining >= requested )`

Claims the indicated number of resources requested when the provided test function evaluates to true.

```javascript
// wait for there to be at least two more resources than the 3 we're requesting
sem.getWhen( 3, (remaining, requested, available) => remaining > requested + 2 )
// do whatever
sem.release( 3 );
```



## Re-Configuring

With care, an existing semaphore can be reconfigured using the following methods. In particular, no guarantees are made to ensure that release() is not called too many times in the case that the available number of resources is reduced, or the remaining number of resources is increased.

### `setAvailable( available )`
### `fSetAvailable( available )`

Resets the total available resources. Checks to see if the new configuration releases any waiting promises


### `setRemaining( remaining )`
### `fSetRemaining( remaining )`

Resets the total remaining resources. Checks to see if the new configuration releases any waiting promises



## APPENDIX

definition of `sleep()` used in the example above

```javascript
	function sleep( dtm ){
		return new Promise( fOk => setTimeout( fOk, dtm ));
	}
```

