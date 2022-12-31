import * as solanaWeb3 from '@solana/web3.js';
// @ts-ignore
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import * as fs from "fs";

(async() => {
    // @ts-ignore
    const connection = new solanaWeb3.Connection(process.env.RPC_ENDPOINT);
    let signatures: any[] = [];
    // @ts-ignore
    const address = new solanaWeb3.PublicKey(process.env.ADDRESS);
    const _ = await connection.getSignaturesForAddress(
        address,
    );
    signatures = [
        ..._
    ];
    while ( true ) {
        const _ = await connection.getSignaturesForAddress(
            address,
            {
                "before": signatures[signatures.length - 1].signature
            }
        );
        if ( _.length === 0 )
            break;
        signatures = [
            ...signatures,
            ..._
        ];
    }
    const data = JSON.stringify(signatures);
    fs.writeFileSync(`./out/getAllSignaturesForAddress_${address.toBase58()}`, data);
    console.log(`saved ${signatures.length} signatures to file.`);
})();