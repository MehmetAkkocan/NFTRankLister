const fs = require("fs");
import axios from 'axios';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import * as web3 from '@solana/web3.js';

var dataMint = fs.readFileSync("./src/hashlist.json");
var mintArray = JSON.parse(dataMint);

var rankArraySoldier: any = [];
var rankArrayCaptain: any = [];
var rankArrayKnight: any = [];
var rankArrayWarlord: any = [];
var rankArrayLegendary: any = [];

const connection = new web3.Connection('https://rpc.ankr.com/solana', {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 1000
});

function JsonRank(_name: string, _token: string, _rank: string) {
    let addData = { "name": _name, "token": _token };
    _rank === 'Soldier' ? rankArraySoldier.push(addData) : null;
    _rank === 'Captain' ? rankArrayCaptain.push(addData) : null;
    _rank === 'Knight' ? rankArrayKnight.push(addData) : null;
    _rank === 'Warlord' ? rankArrayWarlord.push(addData) : null;
    _rank === 'Legendary' ? rankArrayLegendary.push(addData) : null;
}

function TokensRank(e: any, address: string) {
    e.data.attributes.find((x: any) => {
        if (x.trait_type === 'Rank') {
            switch (x.value) {
                case 'Soldier':
                    JsonRank(e.data.name, address, 'Soldier')
                    break;
                case 'Captain':
                    JsonRank(e.data.name, address, 'Captain')
                    break;
                case 'Knight':
                    JsonRank(e.data.name, address, 'Knight')
                    break;
                case 'Warlord':
                    JsonRank(e.data.name, address, 'Warlord')
                    break;
                case 'Legendary':
                    JsonRank(e.data.name, address, 'Legendary')
                    break;
                default:
                    console.log('Error:switch-default')
                    break;
            }
        }
    })
}

async function RankList() {
    (async () => {
        for (let mintAddress of mintArray) {
            let tokenOwner = new web3.PublicKey(mintAddress);
            var nfts: any;
            try {
                nfts = await Metadata.findByMint(connection, tokenOwner)
            }
            catch (e) {
                console.log(e)
            }

            axios({
                method: 'get',
                headers: {
                    Accept: 'application/json'
                },
                url: (nfts.data.data.uri).toString(),
                timeout: 1000 * 1000,
                responseType: 'json'
            })
                .then(function (response) {
                    TokensRank(response, mintAddress);
                })
                .catch(
                    function (error) {
                        console.log(error + " " + nfts.data.mint)
                        return Promise.reject(error)
                    }
                );
        }
        fs.writeFileSync(`./src/ranks/Soldier.json`, JSON.stringify(rankArraySoldier))
        fs.writeFileSync(`./src/ranks/Captain.json`, JSON.stringify(rankArrayCaptain))
        fs.writeFileSync(`./src/ranks/Knight.json`, JSON.stringify(rankArrayKnight))
        fs.writeFileSync(`./src/ranks/Warlord.json`, JSON.stringify(rankArrayWarlord))
        fs.writeFileSync(`./src/ranks/Legendary.json`, JSON.stringify(rankArrayLegendary))
    }
    )();
}

export default RankList();