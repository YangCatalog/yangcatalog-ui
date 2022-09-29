class Module {
    name: string;
    revision: string;
    organization: string;
    'conformance-type': string;
    'feature-set': string;
    'os-type': string;
    'os-versions': string;
}

class SoftwareFlavor {
    name: string;
    protocols: any[];
    modules: Module[];

    constructor(data: any) {
        this.name = data['name'];
        this.protocols = data['protocols'];
        this.modules = data['modules']['module'];
    }
}

export class SoftwareVersion {
    name: string;
    'software-flavors': SoftwareFlavor[];

    constructor(data: any) {
        this.name = data['name'];
        this['software-flavors'] = data['software-flavors']['software-flavor'].map((swFlavor: SoftwareFlavor) => (
            new SoftwareFlavor(swFlavor)
        ));
    }

    getSoftwareFlavorsNames() {
        return this['software-flavors'].map((swFlavor: SoftwareFlavor) => swFlavor.name);
    }

    getSoftwareFlavors() {
        return this['software-flavors'].map((swFlavor: SoftwareFlavor) => swFlavor);
    }
}

export class YangPlatformData {
    name: string;
    'software-versions': SoftwareVersion[];

    constructor(data: any) {
        this.name = data['name'];
        this['software-versions'] = data['software-versions']['software-version'].map((swVersion: SoftwareVersion) => (
            new SoftwareVersion(swVersion)
        ));
    }

    getSoftwareVersionsNames() {
        return this['software-versions'].map((swVersion: SoftwareVersion) => swVersion.name);
    }

    getSoftwareVersions() {
        return this['software-versions'].map((swVersion: SoftwareVersion) => swVersion);
    }
}

