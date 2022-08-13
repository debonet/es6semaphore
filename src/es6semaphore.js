class Semaphore {
	// ----------------------------------------------------
	// private members
	#c = 0;
	#cAll = 0;
	#vf = [];	
	
	// ----------------------------------------------------
	constructor (c){
		this.#c = c;
		this.#cAll = c;
	}
	
	// ----------------------------------------------------
	// getwhen 
	fpGetWhen( d = 1, fbTest = ( c, d ) => c >= d ){
		const self = this;

		return new Promise((fOk) => {
			function f() {
				if ( fbTest( self.#c, d, self.#cAll )){
					self.#c -= d;
					fOk();
					return true;
				}
				else{
					self.#vf.push( f );
					return false;
				}
			}

			f();
		});
	}

	// ----------------------------------------------------
	fpGet( d = 1 ) {
		return this.fpGetWhen( d, ( c, d ) => c >= d );
	}
	
	// ----------------------------------------------------
	fpWhen( fb = ( c, cAll ) => { return c >= 0; } ) {
		return this.fpGetWhen( 0, (c,d,cAll)=>fb(c,cAll) );
	}

	// ----------------------------------------------------
	fpWhenAny(){
		return this.fpGetWhen( 0, ( c, d, cAny ) => { return c > 0; });
	}

	// ----------------------------------------------------
	fpWhenAll(){
		return this.fpGetWhen( 0, ( c, d, cAll ) => { return c == cAll; });
	}

	// ----------------------------------------------------
	fpWhenNone() {
		return this.fpGetWhen( 0, ( c ) => { return c == 0; } );
	}

	// ----------------------------------------------------
	fcRemaining(){
		return this.#c;
	}
	
	// ----------------------------------------------------
	fcAvailable(){
		return this.#cAll;
	}
	
	// ----------------------------------------------------
	// signal / release
	fRelease( d = 1 ) {
		this.#c += d;
		let cQueue = this.#vf.length;
		for (let n=0; n<cQueue; n++){
			let f = this.#vf.shift();
			f();
		}
	}
}


// aliases
Semaphore.prototype.lock = Semaphore.prototype.fpGet;
Semaphore.prototype.get = Semaphore.prototype.fpGet;
Semaphore.prototype.wait = Semaphore.prototype.fpGet;

Semaphore.prototype.getWhen = Semaphore.prototype.fpGetWhen;

Semaphore.prototype.when = Semaphore.prototype.fpWhen;
Semaphore.prototype.check = Semaphore.prototype.fpWhen;

Semaphore.prototype.whenAny = Semaphore.prototype.fpWhenAny;
Semaphore.prototype.checkAny = Semaphore.prototype.fpWhenAny;

Semaphore.prototype.whenAll = Semaphore.prototype.fpWhenAll;
Semaphore.prototype.checkAll = Semaphore.prototype.fpWhenAll;

Semaphore.prototype.whenNone = Semaphore.prototype.fpWhenNone;
Semaphore.prototype.checkNone = Semaphore.prototype.fpWhenNone;

Semaphore.prototype.remaining = Semaphore.prototype.fcRemaining;

Semaphore.prototype.all = Semaphore.prototype.fcAll;

Semaphore.prototype.release = Semaphore.prototype.fRelease;
Semaphore.prototype.unlock = Semaphore.prototype.fRelease;
Semaphore.prototype.signal = Semaphore.prototype.fRelease;



module.exports = Semaphore;
