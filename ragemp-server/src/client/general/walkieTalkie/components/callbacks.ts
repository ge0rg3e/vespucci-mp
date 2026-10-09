import * as rpc from 'rage-rpc';
import { setWalkieIsRaised } from './functions';

rpc.on('interfaces:forceClose', () => setWalkieIsRaised(false));
rpc.on('interfaces:mainInterfaceIsOpening', () => setWalkieIsRaised(false));
rpc.on(`walkieTalkie:putDown`, () => setWalkieIsRaised(false));
