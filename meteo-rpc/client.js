const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './meteo.proto';

// Chargement du fichier .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const meteoProto = grpc.loadPackageDefinition(packageDefinition).meteo;

// Création du client
const client = new meteoProto.MeteoService('localhost:50051', grpc.credentials.createInsecure());

client.GetMeteo({ name: 'Paris'}, (err, response) => {
  if (err) console.error(err);
  else console.log(response.temperature);
});
