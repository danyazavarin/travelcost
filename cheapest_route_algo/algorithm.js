import axios from 'axios';

let startingPoint = 'Мотовилихинский р-н, Пермь';
let endingPoint = 'Кунгур, Пермь';
let fuelConsumption = 0.102;
let fuelType = 'АИ-92';

let regionalPrices = new Map();
regionalPrices.set([
    'Республика Адыгея',
    'Астраханская обл.',
    'Волгоградская обл.',
    'Респ. Калмыкия',
    'Краснодарский край',
    'Крым',
    'Ростовская обл.',
    'Севастополь'
], {
    'АИ-92': 49.12,
    'АИ-95': 53.53,
    'АИ-100': 66.53,
    'ДТ': 57.66,
    'СГ': 21.9
});
regionalPrices.set([
    'Белгородская обл.', 'Брянская обл.',
    'Владимирская обл.', 'Воронежская обл.',
    'Ивановская обл.',   'Калужская обл.',
    'Костромская обл.',  'Курская обл.',
    'Липецкая обл.',     'Москва',
    'Московская обл.',   'Орловская обл.',
    'Рязанская обл.',    'Смоленская обл.',
    'Тамбовская обл.',   'Тверская обл.',
    'Тульская обл.',     'Ярославская обл.'
], {
    'АИ-92': 48.87,
    'АИ-95': 53.69,
    'АИ-100': 65.8,
    'ДТ': 60.77,
    'СГ': 22.35
});
regionalPrices.set([
    'Респ. Дагестан',
    'Респ. Ингушетия',
    'Кабардино-Балкарская Респ.',
    'Карачаево-Черкесская Республика',
    'Респ. Северная Осетия-Алания',
    'Ставропольский край',
    'Чеченская Респ.'
], {
    'АИ-92': 48.87,
    'АИ-95': 53.39,
    'АИ-100': 66.06,
    'ДТ': 58.02,
    'СГ': 18.29
});
regionalPrices.set([
    'Архангельская обл.',
    'Вологодская обл.',
    'Калининградская обл.',
    'Респ. Карелия',
    'Респ. Коми',
    'Мурманская обл.',
    'Ненецкий автономный округ',
    'Новгородская обл.',
    'Псковская обл.',
    'Санкт-Петербург'
], {
    'АИ-92': 50.89,
    'АИ-95': 53.74,
    'АИ-100': 64.17,
    'ДТ': 65.94,
    'СГ': 25.26
});
regionalPrices.set([
    'Респ. Башкортостан',
    'Кировская обл.',
    'Респ. Марий Эл',
    'Респ. Мордовия',
    'Нижегородская обл.',
    'Оренбургская обл.',
    'Пензенская обл.',
    'Пермский край',
    'Самарская обл.',
    'Саратовская обл.',
    'Респ. Татарстан',
    'республика Удмуртия',
    'Ульяновская обл.',
    'Чувашская Респ.'
], {
    'АИ-92': 47.87,
    'АИ-95': 51.08,
    'АИ-100': 64.76,
    'ДТ': 60.66,
    'СГ': 20.15
});
regionalPrices.set([
    'Курганская обл.',
    'Свердловская обл.',
    'Тюменская обл.',
    'Ханты-Мансийский автономный округ',
    'Челябинская обл.',
    'Ямало-Ненецкий автономный округ'
], {
    'АИ-92': 50.28,
    'АИ-95': 51.38,
    'АИ-100': 65.7,
    'ДТ': 63.2,
    'СГ': 19.81
});
regionalPrices.set([
    'Респ. Алтай',
    'Алтайский край',
    'Иркутская обл.',
    'Кемеровская обл.',
    'Красноярск',
    'Новосибирская обл.',
    'Омская обл.',
    'Томская обл.',
    'Респу́блика Тыва́',
    'Респ. Хакасия'
], {
    'АИ-92': 48.92,
    'АИ-95': 51.13,
    'АИ-100': 65.8,
    'ДТ': 65.94,
    'СГ': 25.26
});
regionalPrices.set([
    'Амурская обл.',
    'Респ. Бурятия',
    'Еврейская автономная область',
    'Забайкальский край',
    'Камчатский край',
    'Магаданская обл.',
    'Приморский край',
    'Респ. Саха (Якутия)',
    'Сахалинская обл.',
    'Хабаровский край',
    'Чукотский автономный округ'
], {
    'АИ-92': 48.92,
    'АИ-95': 51.13,
    'АИ-100': 65.7,
    'ДТ': 65.99,
    'СГ': 20.15
});

/**
 * TEST RESULT:
 * [
 *   'ChIJGaJ00ArE6EMR0OQKD4zQyh0',
 *   'ChIJ7RwghIvA6EMRqHoBaV71UTY',
 *   'ChIJ4RGEYCTH6EMRvNhUj9pUcDY',
 *   'ChIJBS-aKs9p6EMRYnC1BJESVhE',
 *   444.92
 * ]
 */

getPlace(stringToUrlRequest(startingPoint)).then(
    origin => {
        getPlace(stringToUrlRequest(endingPoint)).then(
            destination => {
                getDirection(destination, origin).then(
                    waypoints => {
                        infoAboutPetrolStationsReceiver(waypoints[0].steps, waypoints[0].distance.value / 1000).then(gasStationsWithPriority => {
                            let routes = new WeightedGraph();
                            routes.addVertex(origin);
                            for (let i = 0; i < gasStationsWithPriority.length; i++) {
                                for (let j = 0; j < gasStationsWithPriority[i].length; j++) {
                                    routes.addVertex(gasStationsWithPriority[i][j]);
                                }
                            }
                            routes.addVertex(destination);
                            graphOfRoutesBetweenStationsMaker(0, 0, 0, routes, gasStationsWithPriority, origin).then(graphWithoutRoutesToDest => {
                                let stationsNearEnd = gasStationsWithPriority.length - 1;
                                for (let i = 0; i < gasStationsWithPriority[stationsNearEnd].length; i++) {
                                    graphWithoutRoutesToDest.addEdge(gasStationsWithPriority[stationsNearEnd][i], destination, 0);
                                }
                                let routeWithTotalPrice = graphWithoutRoutesToDest.Dijkstra(origin, destination);
                                let price = routeWithTotalPrice.pop();
                                console.log(price);
                                getDirection(
                                    routeWithTotalPrice[routeWithTotalPrice.length - 1],
                                    routeWithTotalPrice[0],
                                    routeWithTotalPrice.slice(1, routeWithTotalPrice.length - 1)
                                ).then(routeForMap => console.log(routeForMap));
                            });
                        });
                    },
                    error => console.log(error.name)
                );
            },
            error => console.log(error.name)
        );
    },
    error => console.log(error.name)
);

function refuelPriceCount(response) {
    for (let regionsWithPrices of regionalPrices.keys()) {
        for (let region of regionsWithPrices) {
            if (~response.end_address.indexOf(region)) {
                return regionalPrices.get(regionsWithPrices)[fuelType] * fuelConsumption * response.distance.value / 1000;
            }
        }
    }
}

function graphOfRoutesBetweenStationsMaker(i, j, k, routes, gasStationsWithPriority, origin = '') {
    if (i < gasStationsWithPriority.length) {
        if (j < gasStationsWithPriority[i].length) {
            if (i < 1) {
                return getDirection(gasStationsWithPriority[i][j], origin)
                    .then(response => {
                            routes.addEdge(origin, gasStationsWithPriority[i][j], refuelPriceCount(response[0]));
                            return graphOfRoutesBetweenStationsMaker(i, ++j, k, routes, gasStationsWithPriority, origin);
                        }
                    );
            } else if (k < gasStationsWithPriority[i-1].length) {
                return getDirection(gasStationsWithPriority[i][j], gasStationsWithPriority[i-1][k])
                    .then(response => {
                            routes.addEdge(
                                gasStationsWithPriority[i-1][k],
                                gasStationsWithPriority[i][j],
                                refuelPriceCount(response[0])
                            );
                            return graphOfRoutesBetweenStationsMaker(i, j, ++k, routes, gasStationsWithPriority);
                        }
                    );
            } else {
                return graphOfRoutesBetweenStationsMaker(i, ++j, 0, routes, gasStationsWithPriority);
            }
        } else {
            return graphOfRoutesBetweenStationsMaker(++i, 0, k, routes, gasStationsWithPriority);
        }
    }
    return new Promise(resolve => resolve(routes));
}

function infoAboutPetrolStationsReceiver(waypoints, totalDistance, distanceBetweenWaypoints = 0, startPosition = 0, waypointsWithPriority = []) {
    while (totalDistance >= 50) {
        if (startPosition < waypoints.length) {
            distanceBetweenWaypoints += waypoints[startPosition].distance.value / 1000;
        }
        if (distanceBetweenWaypoints >= 50) {
            return getPetrolStations(waypoints[startPosition].start_location).then(gasStations => {
                waypointsWithPriority.push(gasStations);

                return infoAboutPetrolStationsReceiver(waypoints, totalDistance - 50,distanceBetweenWaypoints - 50, ++startPosition, waypointsWithPriority);
            });
        }
        startPosition++;
    }

    return new Promise(resolve => resolve(waypointsWithPriority));
}

function stringToUrlRequest(string) {
    return string.trim()
        .split(",").join("%2C")
        .split(".").join("%2E")
        .split("-").join("%2D")
        .split(":").join("%3A")
        .split(";").join("%3B")
        .split(" ").join("%20")
        .split("(").join("%28")
        .split(")").join("%29")
        .split("'").join("%27")
        .split('"').join("%22")
        .split("/").join("%2F");
}

function getPlace(query) {
    let config = axios.get(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?' +
        'input=' + query + '&' +
        'inputtype=textquery&' +
        'key=AIzaSyCTS8q-X1lmFn8qwOKLaW6kHxLFQjF0ERA'
    );

    return config.then(response => {
        return new Promise(resolve => resolve(response.data.candidates[0].place_id));
    })
        .catch(error => {
            return new Promise((resolve, reject) => reject(error));
        });
}
function getDirection(destination, origin, waypoints) {
    let route = axios.get(
        'https://maps.googleapis.com/maps/api/directions/json?' +
        'destination=place_id%3A' + destination + '&' +
        'origin=place_id%3A' + origin + '&' +
        (waypoints ? 'waypoints=place_id%3A' + waypoints.join('%7Cplace_id%3A') + '&' : '') +
        'language=ru&' +
        'key=AIzaSyCTS8q-X1lmFn8qwOKLaW6kHxLFQjF0ERA'
    );

    return route.then(response => {
        return new Promise(resolve => resolve(response.data.routes[0].legs));
    })
        .catch(error => {
            return new Promise((resolve, reject) => reject(error));
        });
}

function getPetrolStations(location) {
    let stations = axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + [location.lat, location.lng].join("%2C") + '&' +
        'radius=20000&' +
        'type=gas_station&' +
        'language=ru&' +
        'key=AIzaSyCTS8q-X1lmFn8qwOKLaW6kHxLFQjF0ERA'
    );

    return stations.then(response => {
        let operationalStations = [];
        for (let station of response.data.results) {
            if (!station.business_status.localeCompare('OPERATIONAL')) {
                /*let stationInfo = new Map();
                stationInfo.set(station.vicinity, station.place_id);*/
                operationalStations.push(station.place_id);
            }
        }
        if (operationalStations.length) {
            return new Promise(resolve => resolve(operationalStations));
        } else {
            return getAtLeastOnePetrolStation(location);
        }
    })
        .catch(error => {
            return new Promise((resolve, reject) => reject(error));
        });
}

/**
 * TEST (for radius equals to 500 meters):
 * getAtLeastOnePetrolStation({'lat': 58.012714600438365, 'lng': 56.30158207694994}).then(response => {
 *     for (let item of response) {
 *         console.log(item);
 *     }
 * });
 * RESULT: ChIJn2rUE5y46EMRwFtoTKcUDGg
 */

function getAtLeastOnePetrolStation(location) {
    let stations = axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + [location.lat, location.lng].join("%2C") + '&' +
        'radius=50000&' +
        'type=gas_station&' +
        'language=ru&' +
        'key=AIzaSyCTS8q-X1lmFn8qwOKLaW6kHxLFQjF0ERA'
    );

    return stations.then(response => {
        let operationalStations = [];
        for (let station of response.data.results) {
            if (!station.business_status.localeCompare('OPERATIONAL')) {
                operationalStations.push(station);
            }
        }
        if (operationalStations.length) {
            return new Promise(resolve => {
                let distances = operationalStations.map(item => norm(location, item.geometry.location));
                let min = 0;
                for (let i = 1; i < distances.length; i++) {
                    if (distances[i] < distances[min]) {
                        min = i;
                    }
                }

                /*let stationInfo = new Map();
                stationInfo.set(operationalStations[min].vicinity, operationalStations[min].place_id);*/

                resolve([operationalStations[min].place_id]);
            });
        } else {
            return new Promise(resolve => resolve([]));
        }
    })
        .catch(error => {
            return new Promise((resolve, reject) => reject(error));
        });
}

function norm(vectorStart, vectorEnd) {
    let vectorCoords = [vectorEnd.lat - vectorStart.lat, vectorEnd.lng - vectorStart.lng];
    return Math.sqrt(vectorCoords[0]**2 + vectorCoords[1]**2);
}

class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }
    bubbleUp() {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }
    dequeue() { return this.values.shift(); }
    /*sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }*/
}

class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }
    Dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = []; //to return at end
        let smallest;
        let current;
        //build up initial state
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            current = nodes.dequeue();
            smallest = current.val;
            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                path.push(Math.round(current.priority * 100) / 100);
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    //find neighboring node
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    //calculate new distance to neighboring node
                    let candidate = distances[smallest] + nextNode.weight;
                    let nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        //updating new smallest distance to neighbor
                        distances[nextNeighbor] = candidate;
                        //updating previous - How we got to neighbor
                        previous[nextNeighbor] = smallest;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return path.concat(smallest).reverse();
    }
}

/*
var graph = new WeightedGraph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "E", 3);
graph.addEdge("C", "D", 2);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "E", 3);
graph.addEdge("D", "F", 1);
graph.addEdge("E", "F", 1);

console.log(graph.Dijkstra("A", "E"));*/

/*
let routeWithTotalPrice = [
    'ChIJGaJ00ArE6EMR0OQKD4zQyh0',
    'ChIJ7RwghIvA6EMRqHoBaV71UTY',
    'ChIJ4RGEYCTH6EMRvNhUj9pUcDY',
    'ChIJBS-aKs9p6EMRYnC1BJESVhE',
    444.92
];
let price = routeWithTotalPrice.pop();
console.log(price);
getDirection(
    routeWithTotalPrice[routeWithTotalPrice.length - 1],
    routeWithTotalPrice[0],
    routeWithTotalPrice.slice(1, routeWithTotalPrice.length - 1)
).then(routeForMap => console.log(routeForMap));*/