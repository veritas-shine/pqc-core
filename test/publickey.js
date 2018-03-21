import chai, {expect} from 'chai'

const should = chai.should()
import pqccore from '../lib'

const {PrivateKey, Networks, PublicKey} = pqccore

describe('PublicKey', () => {
  const pubhash = '04401d387c718f5fe144dd094400ef6a58e8c83023f6bd3e7ab48296e88f91b4ebaf7a4621ed9cdd9be0e3e0a8383580c4ecb25f0f0238637bb8101e97d4ec5054fc'

  describe('public key init', () => {
    it('should create public key from hash', () => {
      const key = new PublicKey(pubhash);
      key.toAddress().toString().should.equal('Gb45hMKzxfgKdSTi6kn133WrS7Hre3evBk');
    });
  });

  describe('validating errors on creation', () => {
    it('errors if data is missing', () => {
      (function () {
        return new PublicKey();
      }).should.throw('First argument is required, please include public key data.');
    });

    it('errors if the argument is of an unrecognized type', () => {
      (function () {
        return new PublicKey(new Error());
      }).should.throw('First argument is an unrecognized data format.');
    });
  });

  describe('instantiation', () => {
    it('from a private key', function() {
      this.timeout(20 * 1000)
      const privhex = '9076537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbff48a7cadb51d29a13b6b72ac37a8cf71e72a6fd8c868c6a98cc95ea0b794a87a';
      const pubhex = '04401d387c718f5fe144dd094400ef6a58e8c83023f6bd3e7ab48296e88f91b4ebaf7a4621ed9cdd9be0e3e0a8383580c4ecb25f0f0238637bb8101e97d4ec5054fc';
      const privkey = new PrivateKey(Buffer.from(privhex, 'hex'));
      const pk = new PublicKey(privkey);
      pk.toString().should.equal(pubhex);
    });

    it('problematic secp256k1 public keys', function() {
      this.timeout(20 * 1000)
      const knownKeys = [
        {
          wif: '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct',
          priv: '90951e9b84c4f35535699251dc79d27eeb02c1a5475e080d6108ea4932222755170a17fa034b54160857282e82026f37b72bd43441c9d775e739580a4d10ef4955',
          pub: '04401d387c718f5fe144dd094400ef6a58e8c83023f6bd3e7ab48296e88f91b4ebaf7a4621ed9cdd9be0e3e0a8383580c4ecb25f0f0238637bb8101e97d4ec5054fc',
        },
        {
          wif: '2SBqZRcBcRuuSresM76sFWrLR83G3WsMUvhwtJezKYjY9tWBiUyFHGdVWGGiuzmV5kexVoK9xUAFctMM44XxWXN81o8jtwy',
          priv: '900f1b6da2cdfa15ed58de960b506b391bc7eab147d117a89b212359e7804676aa06427f9d7ccfbffaeae6d995c7e41f3621c6eb0d87892979aafcd1abc1f9b677',
          pub: '04409e78f21b2983d4a1148abc30d6a34dc587a1f7908da3e076f110636905912174643a3aba3bcb03dc51bf1225cf68aefe1dcd29fc83c326614b294b79c42fa36a',
        }
      ];

      for (let i = 0; i < knownKeys.length; i++) {
        // const privkey = PrivateKey.fromRandom()
        // const pubkey = privkey.toPublicKey()
        // console.log(privkey.toString(), privkey.toWIF(), pubkey)
        const privkey = new PrivateKey(knownKeys[i].wif);
        const pubkey = privkey.toPublicKey()
        console.log(63, pubkey.toString())
        pubkey.toString().should.equal(knownKeys[i].pub);
      }
    });

    it('from a compressed public key', () => {
      const publicKeyHex = '04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0';
      const publicKey = new PublicKey(publicKeyHex);
      publicKey.toString().should.equal(publicKeyHex);
    });


    it('from another publicKey', () => {
      const publicKeyHex = '04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0';
      const publicKey = new PublicKey(publicKeyHex);
      const publicKey2 = new PublicKey(publicKey);
      publicKey.should.equal(publicKey2);
    });

    it('sets the network to defaultNetwork if none provided', () => {
      const publicKeyHex = '04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0';
      const publicKey = new PublicKey(publicKeyHex);
      publicKey.network.should.equal(Networks.defaultNetwork);
    });
  });


  describe('#getValidationError', () => {
    it('should recieve a boolean as true for uncompressed', () => {
      const valid = PublicKey.isValid('04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0');
      valid.should.equal(true);
    });
  });

  describe('#json/object', () => {
    it('should input/ouput json', () => {
      const json = JSON.stringify({
        buffer: '04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0',
        compressed: true
      });
      const pubkey = new PublicKey(JSON.parse(json));
      JSON.stringify(pubkey).should.deep.equal(json);
    });

    it('fails if invalid JSON is provided', () => {
      expect(() => {
        return PublicKey._transformJSON('¹');
      }).to.throw();
    });
  });

  describe('#fromPrivateKey', () => {
    it('should make a public key from a privkey', function() {
      this.timeout(20 * 1000)
      should.exist(PublicKey.fromPrivateKey(PrivateKey.fromRandom()));
    });

    it('should error because not an instance of privkey', () => {
      (function () {
        PublicKey.fromPrivateKey(new Error());
      }).should.throw('Must be an instance of PrivateKey');
    });
  });

  describe('#fromBuffer', () => {
    it('should throw an error on this invalid public key', () => {
      (function () {
        PublicKey.fromBuffer(Buffer.from('091ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
      }).should.throw();
    });

    it('should throw error because not a buffer', () => {
      (function () {
        PublicKey.fromBuffer('091ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
      }).should.throw('Must be a hex buffer of DER encoded public key');
    });
  });

  describe('#fromDER', () => {
    it('should parse this uncompressed public key', () => {
      const pk = PublicKey.fromDER(Buffer.from('04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0', 'hex'));
    });

    it('should throw an error on this invalid public key', () => {
      (function () {
        PublicKey.fromDER(Buffer.from('091ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
      }).should.throw();
    });
  });

  describe('#fromString', () => {
    it('should parse this known valid public key', () => {
      const pk = PublicKey.fromString('04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0');
    });
  });


  describe('#toDER', () => {
    it('should return this uncompressed DER format', () => {
      const pk = PublicKey.fromString('04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0');
      pk.toDER().toString('hex').should.equal('04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0');
    });
  });

  describe('#toAddress', () => {
    it('should output this known mainnet address correctly', () => {
      const pk = new PublicKey('04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0');
      const address = pk.toAddress('livenet');
      address.toString().should.equal('GJ4EzsJswpsnNeNJXKcEPC3mfcMtt8tiso');
    });

    it('should output this known testnet address correctly', () => {
      const pk = new PublicKey('048204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480f');
      const address = pk.toAddress('testnet');
      console.log(address);
      address.toString().should.equal('Lc1okQtmqDVFY4DfdLvxuBWewQoept8B1S');
    });
  });

  describe('#toString', () => {
    it('should print this known public key', () => {
      const hex = '04820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0';
      const pk = PublicKey.fromString(hex);
      pk.toString().should.equal(hex);
    });
  });

  describe('#inspect', () => {
    it('should output known uncompressed pubkey for console', () => {
      const pubkey = PublicKey.fromString('048204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480f');
      pubkey.inspect().should.equal('<PublicKey: 048204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480f>');
    });

    it('should output known compressed pubkey with network for console', function() {
      this.timeout(20 * 1000)
      const privkey = PrivateKey.fromWIF('2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct');
      const pubkey = new PublicKey(privkey);
      pubkey.inspect().should.equal(`<PublicKey: ${pubhash}, uncompressed>`);
    });
  });

  describe('#validate', () => {
    it('should not have an error if pubkey is valid', () => {
      const hex = '048204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480f';
      expect(() => {
        return PublicKey.fromString(hex);
      }).to.not.throw();
    });
  });
});
