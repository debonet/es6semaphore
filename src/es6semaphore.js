module.exports = class Semaphore {
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
	getWhen = this.fpGetWhen;

	// ----------------------------------------------------
	fpGet( d = 1 ) {
		return this.fpGetWhen( d, ( c, d ) => c >= d );
	}
	lock = this.fpGet;
	get = this.fpGet;
	wait = this.fpGet;
	
	// ----------------------------------------------------
	fpWhen( fb = ( c, cAll ) => { return c >= 0; } ) {
		return this.fpGetWhen( 0, (c,d,cAll)=>fb(c,cAll) );
	}
	when = this.fpWhen;
	check = this.fpWhen;

	// ----------------------------------------------------
	fpWhenAll(){
		return this.fpGetWhen( 0, ( c, d, cAll ) => { return c == cAll; });
	}
	whenAll = this.fpWhenAll;
	checkAll = this.fpWhenAll;

	// ----------------------------------------------------
	fpWhenNone() {
		return this.fpGetWhen( 0, ( c ) => { return c == 0; } );
	}
	whenNone = this.fpWhenNone;
	checkNone = this.fpWhenNone;

	// ----------------------------------------------------
	fcRemaining(){
		return this.#c;
	}
	remaining = this.#c;
	
	// ----------------------------------------------------
	fcAvailable(){
		return this.#cAll;
	}
	all = this.fcAll;
	
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
	release = this.fRelease;
	unlock = this.fRelease;
	signal = this.fRelease;

}

