import { Document } from 'flexsearch'

const PRESET = {
  tokenize: 'full',
  context: true,
  minlength: 3,
}

type SearchResult = {
  result: string[]
}

class SearchEngine {
  universe: Universe
  index: typeof Document

  constructor(universe: Universe) {
    this.universe = universe
    this.index = new Document({
      document: {
        id: 'id',
        index: [
          { field: 'appName', ...PRESET },
          { field: 'description', ...PRESET },
          { field: 'keywords', ...PRESET },
          { field: 'author:name', ...PRESET },
          { field: 'author:email', ...PRESET },
        ],
      },
    })
    Object.keys(universe).forEach((id: string) => this.add(id, universe[id]))
  }

  add = (id: string, doc: any) => {
    return this.index.add(id, doc)
  }

  search = (text: string, limit = 10) => {
    let raw: SearchResult[] = []
    text.split(',').forEach((word) => {
      raw = raw.concat(this.index.search(word, limit))
    })
    let ids: string[] = []
    raw.forEach(({ result }) => {
      return result.forEach((id: string) => {
        if (!ids.includes(id)) return ids.push(id)
      })
    })
    return ids.map((id) => this.universe[id].appName)
  }
}

export default SearchEngine
