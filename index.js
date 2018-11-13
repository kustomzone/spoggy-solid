//https://solid.inrupt.com/docs/manipulating-ld-with-rdflib
const $rdf = require('rdflib');
const store  = $rdf.graph();

// NAMESPACES https://github.com/solid/solid-ui/blob/master/src/ns.js
const VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
//const RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');

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
