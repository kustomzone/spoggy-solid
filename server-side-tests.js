//https://solid.inrupt.com/docs/manipulating-ld-with-rdflib
const $rdf = require('rdflib');
const store  = $rdf.graph();

// NAMESPACES https://github.com/solid/solid-ui/blob/master/src/ns.js
const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
//const RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');
const LDP = new $rdf.Namespace('http://www.w3.org/ns/ldp#');

/*1*/
console.log ("\n# /*1*/ EXAMPLE 1 : Using the Store")

//const me = store.sym('https://example.com/alice/card#me');
const me = store.sym('https://smag0.solid.community/profile/card#me');
const profile = me.doc();       //i.e. store.sym(''https://example.com/alice/card#me')



store.add(me, VCARD('fn'), "David Faveris", profile);

//console.log(store)

let fn = store.any(me, VCARD('fn'), null, profile);
let fn1 = store.any(me, VCARD('fn'));

console.log(fn, fn1) // Literal { termType: 'Literal', value: 'David Faveris' } Literal { termType: 'Literal', value: 'David Faveris' }
//console.log(store)



/*2*/
console.log ("\n# /*2*/ EXAMPLE 2 : Using the Store with Turtle")

let text = '<#this>  a  <#Example> .';
let doc = $rdf.sym("https://smag0.solid.community/profile/card#me");
let store2 = $rdf.graph();
$rdf.parse(text, store2, doc.uri, 'text/turtle');  // pass base URI
store2.toNT();
//console.log(store2);
//console.log(store2.toNT());  // {<https://smag0.solid.community/profile/card#this> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://smag0.solid.community/profile/card#Example> .}

let text2 = '<#Pa-Comp>  a  <#Project> .';
$rdf.parse(text2, store2, doc.uri, 'text/turtle');  // pass base URI
store2.toNT();
//console.log(store2);
console.log(store2.toNT());
/* --> {<https://smag0.solid.community/profile/card#this> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://smag0.solid.community/profile/card#Example> .
<https://smag0.solid.community/profile/card#Pa-Comp> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://smag0.solid.community/profile/card#Project> .} */

//console.log($rdf.serialize(doc, store, aclDoc.uri, 'text/turtle'));
console.log ("\n-> store 1 :")
console.log($rdf.serialize(doc, store, null, 'text/turtle'));
console.log ("\n-> store 2 :")
console.log($rdf.serialize(doc, store2, null, 'text/turtle'));
//console.log(store)


/* 3*/
console.log ("\n# /*3*/ EXAMPLE 3 : Using match() to Search the store")
//let quads = store.match(subject, predicate, object, document);
/*Any of the parameters can be null (or undefined) as a wildcard, meaning “any”. The quads which are returned are returned as an array Statement objects.
Examples:
match() gives all the statements in the store
match(null, null, null, doc) gives all the statements in the document
match(me, null, null, me.doc()) gives all the statements in my profile where I am the subject
match(null, null, me, me.doc()) gives all the statements in my profile where I am the object
match(null, LDP(‘contains’)) gives all the statements whose predicate is ldp:contains
*/
console.log ("\n# /*3-1*/ EXAMPLE 3-1 : match 1")
let quads = store.match(null, VCARD('fn'));
console.log(quads)

console.log ("\n# /*3-2*/ EXAMPLE 3-2 : match 2")
//console.log(store2)
let quads2 = store2.match(null, RDF('type'));
console.log(quads2)

console.log ("\n# /*3-3*/ EXAMPLE 3-3 : map")
let oldEmail = $rdf.sym('mailto:scenaristeur@gmail.com')
  let outOfDate = store.match(null, null, oldEmail, null).map(st =>
    {console.log(st.why)});
  console.log(outOfDate)

  //let mentions = store.match(alice, null, null, null).concat(store.match(null, null, alice, null)).map(st => st.why);
  //let aboutAlice = store.connectedStatements(alice, alice.doc()
console.log ("\n# /*3-4*/ EXAMPLE 3-4 : forEach")
  store.match(null, LDP('contains')).forEach(st => {
	console.log(st.subject + 'contains' + st.object)
});

/*4*/
console.log ("\n# /*4*/ EXAMPLE 4 : Making new Statements")
let st = new $rdf.Statement(me, FOAF('name'), "Cornessdady", me.doc());
let st2 = $rdf.st(me, FOAF('name'), "Fada", me.doc());

console.log(st)
console.log("")
console.log(st2)

/*5*/
console.log ("\n# /*5-1*/ EXAMPLE5-1 : Using the Fetcher")

//Let's set up a store as before.

const store5 = $rdf.graph();
const me5 = store5.sym('https://smag0.solid.community/profile/card#me');
const profile5 = me5.doc() //    i.e. store.sym(''https://example.com/alice/card#me');
//const VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

console.log("gives error Server Side: Fetcher: fetch failed: FetchError: request to https://smag0.solid.community/profile/card failed" )
/*
gives errors
'window.localStorage' unavailable.  Creating a (not very useful) in-memory storage object as the default storage interface.
undefined
undefined
[]
Fetcher: <https://smag0.solid.community/profile/card> Non-HTTP fetch error: FetchError: request to https://smag0.solid.community/profile/card failed, reason: getaddrinfo ENOTFOUND smag0.solid.community smag0.solid.community:443
@@ Recording GET failure for <https://smag0.solid.community/profile/card>: 999
Load failedError: Fetcher: fetch failed: FetchError: request to https://smag0.solid.community/profile/card failed, reason: getaddrinfo ENOTFOUND smag0.solid.community smag0.solid.community:443

*/

/*
const fetcher5 =new $rdf.Fetcher(store5);

fetcher5.load(profile5).then(response => {
   let name5 = store5.any(me5, VCARD('fn'));
  console.log("Loaded {$name5 || 'wot no name?'}");
}, err => {
   console.log("Load failed" +  err);
});


let name51 = store5.any(me5, VCARD('fn')) || store5.any(me5, FOAF('name'));
let picture = store5.any(me5, VCARD('hasPhoto')) || store5.any(me5, FOAF('image'));
let names = store5.each(me5, VCARD('fn')).concat(store5.each(me5, FOAF('name')));

console.log(name51)
console.log(picture)
console.log(names)*/
