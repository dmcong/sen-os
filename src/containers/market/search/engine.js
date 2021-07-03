import { Document } from 'flexsearch';

const PRESET = {
  tokenize: 'full',
  context: true,
  minlength: 3
}

class SearchEngine {
  constructor(universe) {
    this.universe = universe;
    this.index = new Document({
      document: {
        id: 'id',
        index: [
          { field: 'name', ...PRESET },
          { field: 'description', ...PRESET },
          { field: 'keywords', ...PRESET },
          { field: 'author:name', ...PRESET },
          { field: 'author:email', ...PRESET },
        ]
      }
    });
    Object.keys(universe).forEach(id => this.add({ id, ...universe[id] }));
  }

  add = (id, doc) => {
    return this.index.add(id, doc);
  }

  search = (text, limit = 10) => {
    let raw = [];
    text.split(',').forEach(word => {
      raw = raw.concat(this.index.search(word, limit));
    });
    let ids = [];
    raw.forEach(({ result }) => {
      return result.forEach(id => {
        if (!ids.includes(id)) return ids.push(id);
      });
    });
    return ids.map(id => this.universe[id].name);
  }
}

export default SearchEngine;
