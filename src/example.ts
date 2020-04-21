import { Minehut } from ".";

(async () => {
    const mh = new Minehut();
    const dz = await mh.servers.fetchOneByName("dangerzone");
    console.log(
        `dangerzone has ${dz.playerCount} out of ${dz.maxPlayers} online!`
    );
})();
