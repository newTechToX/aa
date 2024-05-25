import { connect, disconnect } from "starknetkit";
import { InjectedConnector } from "starknetkit/injected"
import { constants } from 'starknet';
import { encodeShortString } from 'starknet';

// import {InjectedConnector} from ""

// const wallet = await connect([
//   new InjectedConnector({ options: { id: "argentX" } })
// ])

const connectWallet = async () => {
    const { wallet } = await connect({
        connectors: [
            new InjectedConnector({
                options: {id: "argentX"}
            }),
            new InjectedConnector({
              options: {id: "braavos"}
            })
        ]
    })
    console.log(wallet)
    if (wallet && wallet.isConnected){
        return wallet
    }
    return null
  };

async function signMessage(wallet) {
    const typedDataValidate = {
        types: {
          StarkNetDomain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'felt' },
            { name: 'chainId', type: 'felt' },
          ],
          Airdrop: [
            { name: 'address', type: 'felt' },
            { name: 'amount', type: 'felt' },
          ],
          Validate: [
            { name: 'id', type: 'felt' },
            { name: 'from', type: 'felt' },
            { name: 'amount', type: 'felt' },
            { name: 'nameGamer', type: 'string' },
            { name: 'endDate', type: 'felt' },
            { name: 'itemsAuthorized', type: 'felt*' }, // array of felt
            { name: 'chkFunction', type: 'selector' }, // name of function
            { name: 'rootList', type: 'merkletree', contains: 'Airdrop' }, // root of a merkle tree
          ],
        },
        primaryType: 'Validate',
        domain: {
          name: 'myDapp', // put the name of your dapp to ensure that the signatures will not be used by other DAPP
          version: '1',
        //   ChainId: encodeShortString,
          chainId: constants.StarknetChainId.SN_MAIN, // shortString of 'SN_GOERLI' (or 'SN_MAIN'), to be sure that signature can't be used by other network.
        },
        message: {
          id: '0x0000004f000f',
        //   from: '0x2c94f628d125cd0e86eaefea735ba24c262b9a441728f63e5776661829a4066',
          from: '1260309852079744907705764708083968509328442291845648448829469285043760939110',
          amount: '400',
          nameGamer: 'Hector26',
          endDate: '0x27d32a3033df4277caa9e9396100b7ca8c66a4ef8ea5f6765b91a7c17f0109c',
          itemsAuthorized: ['0x01', '0x03', '0x0a', '0x0e'],
          chkFunction: 'check_authorization',
          rootList: [
            {
              address: '0x69b49c2cc8b16e80e86bfc5b0614a59aa8c9b601569c7b80dde04d3f3151b79',
              amount: '1554785',
            },
            {
              address: '0x7447084f620ba316a42c72ca5b8eefb3fe9a05ca5fe6430c65a69ecc4349b3b',
              amount: '2578248',
            },
            {
              address: '0x3cad9a072d3cf29729ab2fad2e08972b8cfde01d4979083fb6d15e8e66f8ab1',
              amount: '4732581',
            },
            {
              address: '0x7f14339f5d364946ae5e27eccbf60757a5c496bf45baf35ddf2ad30b583541a',
              amount: '913548',
            },
          ],
        },
      };
    try {
        console.log(typedDataValidate.domain.chainId)
        const signature = await wallet.account.signMessage(typedDataValidate);
        document.getElementById('status').innerText = 'Message signed: ' + signature;
    } catch (error) {
        document.getElementById('status').innerText = 'Failed to sign message: ' + error.message;
    }
}

document.getElementById('connectButton').addEventListener('click', async () => {
    const wallet = await connectWallet();
    document.getElementById('signMessageButton').disabled = false;
    document.getElementById('signMessageButton').addEventListener('click', () => signMessage(wallet));
});

