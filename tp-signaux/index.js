async function handleSignal(signal) {
    switch(signal){
        case "SIGINT":
            if (canStop){
                console.log(`Nettoyage en cours...`)
                setTimeout(() => {
                    process.exit(0)
                }, 2000)
            }
            break
        case "SIGTERM":
            console.log("Processus terminé")
            break
    }
}

canStop = true

process.on("SIGINT", () => handleSignal("SIGINT"));
process.on("SIGTERM", () => handleSignal("SIGTERM"));

console.log("Application en cours d'exécution.");

setInterval(() => {
    if (canStop){
        console.log("Le processus ne peut être arrêté pour l'instant");
    } else {
        console.log("Le processus peut de nouveau être arrêté");
    }
    canStop = !canStop   
}, 5000);
  