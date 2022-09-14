class DeviationModel {
    name: string;
    revision: string;
}
export class ModuleImplementationModel {
    vendor: string;
    platform: string;
    'software-version': string;
    'software-flavor': string;
    'os-version': string;
    'feature-set': string;
    'os-type': string;
    'conformance-type': string;
    feature?: string[];
    deviation?: DeviationModel[];
}