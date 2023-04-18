import { Meteor } from 'meteor/meteor';

import '/imports/api/qa/qa_records.method.js'
import '/imports/api/qa/qa_records.publication.js'
import '/imports/api/corpus/corpus_records.method.js'
import '/imports/api/corpus/corpus_records.publication.js'
import '/imports/api/json2txt/json2txt_records.method.js'
import '/imports/api/json2txt/json2txt_records.publication.js'
import '/imports/api/pages.publication.js'

Meteor.startup(async () => {

})

// import { LinksCollection } from '/imports/api/links';

// async function insertLink({ title, url }) {
//   await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
// }

// Meteor.startup(async () => {
//   // If the Links collection is empty, add some data.
//   if (await LinksCollection.find().countAsync() === 0) {
//     await insertLink({
//       title: 'Do the Tutorial',
//       url: 'https://www.meteor.com/tutorials/react/creating-an-app',
//     });

//     await insertLink({
//       title: 'Follow the Guide',
//       url: 'https://guide.meteor.com',
//     });

//     await insertLink({
//       title: 'Read the Docs',
//       url: 'https://docs.meteor.com',
//     });

//     await insertLink({
//       title: 'Discussions',
//       url: 'https://forums.meteor.com',
//     });
//   }

//   // We publish the entire Links collection to all clients.
//   // In order to be fetched in real-time to the clients
//   Meteor.publish("links", function () {
//     return LinksCollection.find();
//   });
// });
