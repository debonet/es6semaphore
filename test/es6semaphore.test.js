const Semaphore = require( "../src/es6semaphore.js" );

if (!test){
	test = async function test(s,f){
		await f();
	}
}

function sleep( dtm ){
	return new Promise( fOk => setTimeout( fOk, dtm ));
}

test("ensure semaphore works", async () => {

	let s="";

	async function f(ch) {
		await semaphore.wait();
		await sleep(100);
		s+=ch+",";
		semaphore.signal();
	}
	
	const semaphore = new Semaphore(2);
	
	// these will run serially, one per second
	f('a');
	f('b');
	f('c');
	f('d');
	s+="queued,";
	await semaphore.when(c => c==1 );
	s+="one,";
	await semaphore.whenAll();
	s+="all";

	
	expect(s).toBe( "queued,a,b,c,one,d,all" );
});
		 

	

test("simple semaphore when", async () => {

	let s="";

	function sleep( dtm ){
		return new Promise( fOk => setTimeout( fOk, dtm ));
	}
	
	async function f(ch) {
		await semaphore.wait();
		await sleep(1000);
		s += ch + ",";
		semaphore.signal();
	}
	
	const semaphore = new Semaphore(2);
	
	// these will run serially, one per second
	f('a');
	await semaphore.whenAny();
	
	f('b');
	f('c');
	f('d');
	s+="queued,";
	await semaphore.when(c => c==1 );
	s+="one,";
	await semaphore.whenAll();
	s+="all";

	
	expect(s).toBe( "queued,a,b,c,one,d,all" );
});
		 

	

