/*
 * A quick-and-dirty implementation of Dijkstra's Algorithm
 *
 * There are likely a lot of ways this can be improved. This was literally
 * my first pass at implementing this in Typescript, and it was all
 * "stream-of-consciousness" coding.
 * 
 * Based on the explanation in this excellent video:
 * https://youtu.be/pVfj6mxhdMw
 * 
 */

 // Just a very large value. Thought of using NaN but that makes comparisons messier.
const INFINITY = Number.MAX_VALUE

// Represents a vertex's relation with a neighbor
interface Neighbor {
    vertex: Vertex
    distance: number
}

// Represents a single vertex. Just a name and list of neighbors
class Vertex {
    public neighbors: Neighbor[] = []
    constructor(
        public name: string) { }
}

// A single result
interface Result {
    // The Vertex the result is for
    vertex: Vertex
    // The shortest distance from the start Vertex to this one
    shortestDistance: number
    // The Vertex that comes before this one along the shortest path
    previousVertex: Vertex | null
}

// Map of all the results by Vertex name
const results: { [i: string]: Result } = {}

// Map of Vertex names to Vertex
// This could probably be removed. It's a bit of a remnant from where I thought
// I would need this more, but in the end I only use it to get the starting
// Vertex by name.
const vertexMap: { [i: string]: Vertex } = {}

// The list of unvisited Vertices
const unvisited: Vertex[] = []

// The list of visited Vertices
const visited: Vertex[] = []

// Initialize the data structures
function initialize() {
    // Create the Vertices and add them to the vertexMap by name
    const a = new Vertex('A')
    vertexMap[a.name] = a
    const b = new Vertex('B')
    vertexMap[b.name] = b
    const c = new Vertex('C')
    vertexMap[c.name] = c
    const d = new Vertex('D')
    vertexMap[d.name] = d
    const e = new Vertex('E')
    vertexMap[e.name] = e

    // Add all the neighbors for each vertex
    a.neighbors.push({ vertex: b, distance: 6 })
    a.neighbors.push({ vertex: d, distance: 1 })

    b.neighbors.push({ vertex: a, distance: 1 })
    b.neighbors.push({ vertex: c, distance: 5 })
    b.neighbors.push({ vertex: d, distance: 2 })
    b.neighbors.push({ vertex: e, distance: 2 })

    c.neighbors.push({ vertex: b, distance: 5 })
    c.neighbors.push({ vertex: e, distance: 5 })

    d.neighbors.push({ vertex: a, distance: 1 })
    d.neighbors.push({ vertex: b, distance: 2 })
    d.neighbors.push({ vertex: e, distance: 1 })

    e.neighbors.push({ vertex: b, distance: 2 })
    e.neighbors.push({ vertex: c, distance: 5 })
    e.neighbors.push({ vertex: d, distance: 1 })

    // Populate the unvisited list
    unvisited.push(a, b, c, d, e)

    // Populated the results with starting values
    unvisited.forEach((v) => {
        results[v.name] = { vertex: v, shortestDistance: INFINITY, previousVertex: null }
    })
}

// Visit the given Vertex
//  - Ensure the Vertex has not yet been visited
//  - Find the new total distance from start to each unvisited neighbor
//  - Update the results if the new distance is less than the current neighbor distance
//  - Remove the vertex from the unvisited list
//  - Add the vertex to the visited list
function visitVertex(v: Vertex) {
    const idx = unvisited.indexOf(v)
    if (idx < 0) {
        return
    }
    const curDistance = results[v.name].shortestDistance

    v.neighbors.forEach((n) => {
        if (visited.indexOf(n.vertex) < 0) {
            const newDistance = curDistance + n.distance
            const result = results[n.vertex.name]
            if (newDistance < result.shortestDistance) {
                result.shortestDistance = newDistance
                result.previousVertex = v
                results[n.vertex.name] = result
            }
        }
    })

    unvisited.splice(idx, 1)
    visited.push(v)
}

// Run the algorithem starting at the given Vertex

//  - 
function findPaths(start: Vertex) {
    // Set the distance to the start Vertex to zero
    results[start.name].shortestDistance = 0
    // Visit the start Vertex
    visitVertex(start)

    // While there are unvisited Vertices...
    while (unvisited.length > 0) {
        let minDistance = INFINITY
        let nextVertex: Vertex | null = null
        // Among the remaining unvisited Vertices, find the one with 
        // the current shortest distance from the start
        // This will be the next vertex to visit
        unvisited.forEach((v) => {
            const result = results[v.name]
            if (result.shortestDistance < minDistance) {
                minDistance = result.shortestDistance
                nextVertex = v
            }
        })

        // No next vertex? We're done
        if (!nextVertex) {
            return
        }

        // Visit the chosen next Vertex
        visitVertex(nextVertex)
    }
}

// Initialize the data structures
initialize()

// Find paths starting with node 'A'
findPaths(vertexMap['A'])

// Print the results
const vertexNames = ['A', 'B', 'C', 'D', 'E']
vertexNames.forEach((name) => {
    const result = results[name]
    const previous = (result.previousVertex) ? result.previousVertex.name : ''
    console.log(`${result.vertex.name}\t${result.shortestDistance}\t${previous}`)
})
