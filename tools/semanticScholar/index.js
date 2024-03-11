import fetch from 'node-fetch'
import { promises as fs } from 'fs'

const apiUrl = 'https://api.semanticscholar.org/graph/v1/paper/search'

const getArticles = async (currentYear) => {
  // Params
  const query = 'query=freefem'
  const year = 'year=' + (currentYear - 1) + '-' + currentYear
  const fields =
    'fields=' +
    ['title', 'authors', 'abstract', 'url', 'publicationDate'].join(',')
  const limit = 'limit=99'

  // Fetch
  const res = await fetch(
    apiUrl + '?' + query + '&' + year + '&' + fields + '&' + limit
  )
  const resJSON = await res.json()

  // Sort by date
  const articles = resJSON.data.filter((d) => d?.abstract)
  articles.sort(
    (a, b) =>
      new Date(b.publicationDate).getTime() -
      new Date(a.publicationDate).getTime()
  )

  // Max length 10
  if (articles.length > 10) articles.length = 10

  return articles
}

const main = async () => {
  const currentYear = new Date().getFullYear()

  // Get articles
  let articles = await getArticles(currentYear)

  // Check enought
  if (articles.length < 10) {
    const otherArticles = await getArticles(currentYear - 1)
    articles = [...articles, ...otherArticles]

    // Max length 10
    if (articles.length > 10) articles.length = 10
  }

  // Write
  await fs.writeFile(
    'data/articles.json',
    JSON.stringify({ articles }, null, '  ')
  )
}

main().catch(console.error)
