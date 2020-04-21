# minehut-api

Finally; a complete and fully typed Minehut API wrapper for TypeScript.

## STILL EXPERIMENTAL

minehut-api was only brought back from the day recently; if you find any bugs please make an issue.

## Installation

Use [yarn](https://yarnpkg.com) or [NPM](https://npmjs.com) to install minehut-api.

**Yarn**:

```bash
yarn add minehut-api
```

**NPM**:

```bash
npm install minehut-api
```

## Usage

```ts
import { Minehut } from "minehut-api";

(async () => {
    const mh = new Minehut();
    const dz = await mh.servers.fetchOneByName("dangerzone");
    console.log(
        `dangerzone has ${dz.playerCount} out of ${dz.maxPlayers} online!`
    );
})();
```

## License

This project is licensed under version 3 of the [LGPL](https://choosealicense.com/licenses/lgpl-3.0/).
