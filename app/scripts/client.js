/*eslint-disable no-console */
import firebase from 'firebase';
import sortBy from 'lodash/sortBy';
import config from './config';
import logos from '../logos.json';

firebase.initializeApp(config.firebase);
const database = firebase.database();

async function importJSON() {
  const categoriesCount = {};
  const tagsCount = {};

  try {
    await firebase.auth().signInWithEmailAndPassword('gilbarbara@gmail.com', 'dv885522');
  }
  catch (error) {
    console.log('auth:error', error);
  }

  for (const item of logos.items) {
    console.log(`••• ${item.shortname}`);

    const itemData = {
      name: item.name,
      shortname: item.shortname,
      url: item.url,
      files: item.files,
      tags: item.tags.filter(t => t !== 'vectorized'),
      categories: item.categories,
      updated: item.updated,
      edited: item.edited || false,
      favorite: item.favorite || false,
      vectorized: item.tags.includes('vectorized')
    };

    for (const c of item.categories) {
      if (!categoriesCount[c]) {
        categoriesCount[c] = 0;
      }
      categoriesCount[c]++;
    }

    for (const tag of item.tags) {
      if (tag !== 'vectorized') {
        if (!tagsCount[tag]) {
          tagsCount[tag] = 0;
        }
        tagsCount[tag]++;
      }
    }

    await database.ref().child('items').push(itemData);
  }

  console.log('•• categories');
  let categories = Object.keys(categoriesCount).map(c => ({ name: c, count: categoriesCount[c] }));
  categories = sortBy(categories, o => o.name.toLowerCase());

  for (const cat of categories) {
    console.log(cat.name);
    await database.ref().child('categories').push(cat);
  }

  console.log('•• tags');
  let tags = Object.keys(tagsCount).map(t => ({ name: t, count: tagsCount[t] }));
  tags = sortBy(tags, o => o.name.toLowerCase());

  for (const tag of tags) {
    console.log(tag.name);
    await database.ref().child('tags').push(tag);
  }
}

function getTags() {
  console.log('getTags');

  const tags = database.ref('items').orderByChild('tags').limitToLast(20);

  tags.on('value', snapshot => {
    const cloud = [];

    snapshot.forEach(child => {
      cloud.push(child.val());
    });

    console.log(cloud.reverse());
  });
}

function getItems() {
  console.log('getTags');

  const tags = {};
  const itemsDB = database.ref('items');

  itemsDB.on('value', snapshot => {
    const items = [];

    snapshot.forEach(child => {
      items.push(child.val());
    });

    items.forEach(d => {
      d.tags.forEach(t => {
        if (!{}.hasOwnProperty.call(tags, t)) {
          tags[t] = 0;
        }
        tags[t]++;
      });
    });

    console.log(tags);
  });
}

importJSON();
