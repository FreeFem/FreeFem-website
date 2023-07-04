import fetch from 'node-fetch'
import { promises as fs } from 'fs'

const apiUrl = 'https://www.semanticscholar.org/api/1'

const main = async () => {
    const res = await fetch(apiUrl + '/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
            authors: [],
            coAuthors: [],
            cues: ["CitedByLibraryPaperCue"],
            fieldsOfStudy: [],
            getQuerySuggestions: false,
            hydrateWithDdb: true,
            includeBadges: true,
            includeTldrs: true,
            page: 1,
            pageSize: 10,
            performTitleMatch: true,
            queryString: "freefem",
            requireViewablePdf: false,
            sort: "pub-date",
            useFallbackRankerService: false,
            useFallbackSearchCluster: false,
            venues: [],
            yearFilter: null,
        })
    })
    const resJSON = await res.json()

    await fs.writeFile('data/articles.json', JSON.stringify({ articles: resJSON.results }, null, '  '))
}

main().catch(console.error)