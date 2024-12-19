const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require("axios")
const PROTO_PATH = './meteo.proto';

// Chargement du fichier .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const meteoProto = grpc.loadPackageDefinition(packageDefinition).meteo;

async function getCityInfos(cityName) {
    const response = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search", {
            params: {
                name: cityName,
                count: 1
            }
        }
    )
    const data = response.data
    console.log(data)
    return data.results[0]
}

async function getMeteo(lat, long) {
    const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`,
    )
    const data = response.data
    console.log(data)
    return data
}

const getMeteoInfos = async (call, callback) => {
    const cityInfos = await getCityInfos(call.request.name)
    const meteoInfos = await getMeteo(cityInfos.latitude, cityInfos.longitude)
    const temperature = meteoInfos.hourly.temperature_2m[0]
    callback(null, {temperature})
}

const server = new grpc.Server()
server.addService(meteoProto.MeteoService.service, { GetMeteo: getMeteoInfos })
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running on http://0.0.0.0:50051")
})